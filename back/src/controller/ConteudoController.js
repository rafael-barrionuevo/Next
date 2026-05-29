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
      const { titulo, tipo_midia, genero, sinopse, duracao, url_filme, ano } = req.body;

      if (!ano) {
        throw new Error("O campo 'ano' é obrigatório.");
      }

      let imagePath = null;
      if (req.files && req.files.img_capa) {
        const foto = req.files.img_capa;
        const caminho = `uploads/conteudos/${Date.now()}_${foto.name}`;
        await foto.mv(caminho);
        imagePath = `/${caminho}`;
      } else if (req.body.img_capa) {
        imagePath = req.body.img_capa;
      }

      const conteudoData = {
        titulo,
        tipo_midia,
        sinopse,
        ano: Number(ano),
        ...(imagePath && { img_capa: imagePath })
      };

      if (genero) {
        conteudoData.genero = typeof genero === 'string' ? genero.split(',').map(g => g.trim()) : genero;
      }

      if (tipo_midia === 'filme') {
        conteudoData.filme = {
          duracao,
          url_filme
        };
      }

      const novoConteudo = await ConteudoService.criarConteudo(conteudoData);
      return res.status(201).json(novoConteudo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /conteudos/:id/episodios
  async adicionarEpisodio(req, res) {
    try {
      const { id } = req.params; // ID do conteúdo (Série ou Filme)
      const { numeroTemporada, numero, titulo, descricao, url_video } = req.body;

      let imagePath = null;
      if (req.files && req.files.img_ep) {
        const foto = req.files.img_ep;
        const caminho = `uploads/conteudos/${Date.now()}_${foto.name}`;
        await foto.mv(caminho);
        imagePath = `/${caminho}`;
      } else if (req.body.img_ep) {
        imagePath = req.body.img_ep;
      }

      const dadosEpisodio = {
        numero: Number(numero),
        titulo,
        descricao,
        url_ep: url_video,
        ...(imagePath && { img_ep: imagePath })
      };

      const serieAtualizada = await ConteudoService.adicionarEpisodio(id, Number(numeroTemporada), dadosEpisodio);

      return res.status(201).json({ serie: serieAtualizada });
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

  // PATCH /conteudos/:id
  async atualizarConteudo(req, res) {
    try {
      const { id } = req.params;
      const { titulo, tipo_midia, genero, sinopse, duracao, url_filme, ano } = req.body;

      let imagePath = null;
      if (req.files && req.files.img_capa) {
        const foto = req.files.img_capa;
        const caminho = `uploads/conteudos/${Date.now()}_${foto.name}`;
        await foto.mv(caminho);
        imagePath = `/${caminho}`;
      } else if (req.body.img_capa) {
        imagePath = req.body.img_capa;
      }

      const conteudoData = {
        ...(titulo && { titulo }),
        ...(tipo_midia && { tipo_midia }),
        ...(sinopse && { sinopse }),
        ...(ano && { ano: Number(ano) }),
        ...(imagePath && { img_capa: imagePath })
      };

      if (genero) {
        conteudoData.genero = typeof genero === 'string' ? genero.split(',').map(g => g.trim()) : genero;
      }

      if (tipo_midia === 'filme') {
        conteudoData.filme = {};
        if (duracao) conteudoData.filme.duracao = duracao;
        if (url_filme) conteudoData.filme.url_filme = url_filme;
      }

      const conteudoAtualizado = await ConteudoService.atualizarConteudo(id, conteudoData);
      return res.status(200).json(conteudoAtualizado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // PATCH /conteudos/:id/episodios/:episodioId
  async atualizarEpisodio(req, res) {
    try {
      const { id, episodioId } = req.params;
      const { numeroTemporada, numero, titulo, descricao, url_video } = req.body;

      let imagePath = null;
      if (req.files && req.files.img_ep) {
        const foto = req.files.img_ep;
        const caminho = `uploads/conteudos/${Date.now()}_${foto.name}`;
        await foto.mv(caminho);
        imagePath = `/${caminho}`;
      } else if (req.body.img_ep) {
        imagePath = req.body.img_ep;
      }

      const dadosEpisodio = {
        ...(numero && { numero: Number(numero) }),
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(url_video && { url_ep: url_video }),
        ...(imagePath && { img_ep: imagePath })
      };

      const serieAtualizada = await ConteudoService.atualizarEpisodio(id, Number(numeroTemporada), episodioId, dadosEpisodio);
      return res.status(200).json({ serie: serieAtualizada });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ConteudoController();