const Avaliacao = require("../models/Avaliacao");
const Usuario = require("../models/Usuario");

class AvaliacaoService {
  async criarAvaliacao(dados) {
    const { usuarioId, conteudoId, nota, comentario } = dados;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado.");

    try {
      return await Avaliacao.create({
        usuarioId,
        conteudoId,
        nome_usuario: usuario.nome,
        nota,
        comentario
      });
    } catch (error) {
      if (error.code === 11000) throw new Error("Você já avaliou este conteúdo!");
      throw error;
    }
  }

  async listarAvaliacoes(idConteudo) {
    return await Avaliacao.find({ conteudoId: idConteudo }).sort({ data: -1 });
  }

  async alterarAvaliacao(avaliacaoId, novosDados) {
    const avaliacaoExistente = await Avaliacao.findById(avaliacaoId);
    if (!avaliacaoExistente) {
      throw new Error("Avaliação não encontrada.");
    }
    const { nota, comentario } = novosDados;
    if (nota !== undefined) {
      if (!Number.isInteger(nota) || nota < 0 || nota > 10) {
        throw new Error("A nota deve ser um número inteiro entre 0 e 10.");
      }
    }
    if (comentario !== undefined && comentario.length > 500) {
      throw new Error("O comentário não pode exceder 500 caracteres.");
    }
    // Mongoose também checa os tipos e limites definidos no schema (no validate), mas é bom validar antes para saber onde falhou
    const avaliacaoAtualizada = await Avaliacao.findByIdAndUpdate(
      avaliacaoId,
      { $set: novosDados },
      { new: true, runValidators: true }
    );

    return avaliacaoAtualizada;
  }

  async deletarAvaliacao(avaliacaoId) {
    const deletado = await Avaliacao.findByIdAndDelete(avaliacaoId);
    if (!deletado) {
      throw new Error("Erro ao deletar: Avaliação não encontrada.");
    }
    return deletado;
  }
}

module.exports = new AvaliacaoService();