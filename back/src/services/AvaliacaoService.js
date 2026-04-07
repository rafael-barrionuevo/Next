const Avaliacao = require("../models/Avaliacao");
const Usuario = require("../models/Usuario");

class AvaliacaoService {
  // Criar uma nova avaliação
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
      // Erro 11000 indica violação de índice único (um user só avalia um conteúdo uma vez)
      if (error.code === 11000) throw new Error("Você já avaliou este conteúdo!");
      throw error;
    }
  }

  // Listar avaliações de um conteúdo específico
  async listarAvaliacoes(idConteudo) {
    return await Avaliacao.find({ conteudoId: idConteudo }).sort({ data: -1 });
  }

  // Alterar uma avaliação existente
  async alterarAvaliacao(avaliacaoId, usuarioId, novosDados) {
    const avaliacaoExistente = await Avaliacao.findById(avaliacaoId);
    if (!avaliacaoExistente) {
      throw new Error("Avaliação não encontrada.");
    }
    if (!avaliacaoExistente.usuarioId.equals(usuarioId)) {
      throw new Error("Você não tem permissão para alterar esta avaliação.");
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

    return await Avaliacao.findByIdAndUpdate(
      avaliacaoId,
      { $set: novosDados },
      { new: true, runValidators: true } // runValidators garante que o Schema também valide
    );
  }

  // Deletar uma avaliação
  async deletarAvaliacao(avaliacaoId, usuarioId) {
    const avaliacao = await Avaliacao.findById(avaliacaoId);
    if (!avaliacao) {
      throw new Error("Avaliação não encontrada.");
    }
    if (!avaliacao.usuarioId.equals(usuarioId)) {
      throw new Error("Você não tem permissão para deletar esta avaliação.");
    }

    return await Avaliacao.findByIdAndDelete(avaliacaoId);
  }
}

module.exports = new AvaliacaoService();