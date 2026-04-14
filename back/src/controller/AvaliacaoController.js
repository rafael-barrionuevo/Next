const AvaliacaoService = require("../services/AvaliacaoService");

class AvaliacaoController {
  async criarAvaliacao(req, res) {
    try {
      const { conteudoId, nota, comentario } = req.body;

      const dadosAvaliacao = {
        usuarioId: req.id, // Injeta o ID do token
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
      const { id } = req.params; // ID da avaliação
      const { nota, comentario } = req.body;
      const usuarioId = req.id; // Quem está tentando alterar

      const dadosParaAtualizar = {
        ...(nota !== undefined && { nota: parseInt(nota) }),
        ...(comentario !== undefined && { comentario })
      };

      const avaliacao = await AvaliacaoService.alterarAvaliacao(id, usuarioId, dadosParaAtualizar);
      
      return res.json({ message: "Avaliação alterada!", avaliacao });
    } catch (error) {
      const status = error.message.includes("permissão") ? 403 : 400;
      return res.status(status).json({ error: error.message });
    }
  }

  // DELETE /avaliacoes/:id
  async deletarAvaliacao(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.id; // Quem está tentando deletar

      await AvaliacaoService.deletarAvaliacao(id, usuarioId);
      
      return res.json({ message: "Avaliação removida com sucesso!" });
    } catch (error) {
      const status = error.message.includes("permissão") ? 403 : 404;
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = new AvaliacaoController();