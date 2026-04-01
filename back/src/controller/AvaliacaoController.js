const AvaliacaoService = require("../services/AvaliacaoService");

class AvaliacaoController {
  async criarAvaliacao(req, res) {
    try {
      const { usuarioId, conteudoId, nota, comentario } = req.body;

      const dadosAvaliacao = {
        usuarioId,
        conteudoId,
        nota: parseInt(nota), 
        comentario
      };

      const novaAvaliacao = await AvaliacaoService.criarAvaliacao(dadosAvaliacao);
      return res.status(201).json(novaAvaliacao);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listarAvaliacoes(req, res) {
    try {
      const { conteudoId } = req.params;
      const lista = await AvaliacaoService.listarAvaliacoes(conteudoId);
      return res.status(200).json(lista);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /avaliacoes/:id
  async alterarAvaliacao(req, res) {
    try {
      const { id } = req.params;
      const { nota, comentario } = req.body;

      // Desacoplamento: Apenas nota e comentário podem ser editados
      const dadosParaAtualizar = {
        ...(nota !== undefined && { nota: parseInt(nota) }),
        ...(comentario !== undefined && { comentario })
      };

      const avaliacao = await AvaliacaoService.alterarAvaliacao(id, dadosParaAtualizar);
      return res.json({ message: "Avaliação alterada!", avaliacao });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /avaliacoes/:id
  async deletarAvaliacao(req, res) {
    try {
      const { id } = req.params;
      await AvaliacaoService.deletarAvaliacao(id);
      return res.json({ message: "Avaliação removida com sucesso!" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new AvaliacaoController();