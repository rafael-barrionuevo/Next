const ConteudoService = require("../services/ConteudoService");

class ConteudoController {
  // GET /conteudos
  async listarConteudos(req, res) {
    try {
      const lista = await ConteudoService.listarConteudos();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar conteúdos." });
    }
  }

  // POST /conteudos
  async criarConteudo(req, res) {
    try {
      const novoConteudo = await ConteudoService.criarConteudo(req.body);
      return res.status(201).json(novoConteudo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /conteudos/:id/episodios
  async adicionarEpisodio(req, res) {
    try {
      const { id } = req.params; // ID do conteúdo (Série ou Filme)
      const { numeroTemporada, dadosEpisodio } = req.body;

      const serieAtualizada = await ConteudoService.adicionarEpisodio(id, numeroTemporada, dadosEpisodio);
      
      return res.status(201).json({serie: serieAtualizada});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  // DELETE /conteudos/:id
  async deletarConteudo(req, res) {
    try {
      const { id } = req.params; // ID do conteúdo (Série ou Filme)
      await ConteudoService.deletarConteudo(id);
      return res.status(200).json({ message: "Conteúdo removido com sucesso!" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // DELETE /conteudos/:id/episodios
  async deletarEpisodio(req, res) {
    try {
      const { id } = req.params; // ID do conteúdo (série)
      const { numeroTemporada, episodioId } = req.body;
      const serieAtualizada = await ConteudoService.deletarEpisodio(id, numeroTemporada, episodioId);
      
      return res.json({ message: "Episódio removido com sucesso!", serie: serieAtualizada });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ConteudoController();