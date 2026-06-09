const Conteudo = require("../models/Conteudo");

class ConteudoService {
  // Listar todos os conteúdos
  async listarConteudos() {
    return await Conteudo.find(); 
  }

  // Pesquisar conteúdos por texto e/ou gênero
  async pesquisarConteudos({ q, genero, tipo_midia }) {
    const filtro = {};

    // Filtro de texto — busca no título e sinopse (case-insensitive)
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filtro.$or = [
        { titulo: regex },
        { sinopse: regex }
      ];
    }

    // Filtro por gênero
    if (genero && genero.trim()) {
      filtro.genero = { $in: genero.split(',').map(g => g.trim()) };
    }

    // Filtro por tipo de mídia
    if (tipo_midia && tipo_midia.trim()) {
      filtro.tipo_midia = tipo_midia.trim();
    }

    return await Conteudo.find(filtro).sort({ createdAt: -1 });
  }

  // Listar todos os gêneros únicos
  async listarGeneros() {
    const generos = await Conteudo.distinct('genero');
    return generos.filter(Boolean).sort();
  }

  // Criar novo conteúdo
  async criarConteudo(dados) {
    const existeConteudo = await Conteudo.findOne({ titulo: dados.titulo });
    if (existeConteudo) {
      throw new Error("O conteúdo já foi cadastrado.");
    }

    return await Conteudo.create(dados);
  }

  // Adicionar episódio a uma temporada de uma série
  async adicionarEpisodio(serieId, numeroTemporada, dadosEpisodio) {
  const existeSerie = await Conteudo.findById(serieId);
  if (!existeSerie) {
    throw new Error("Série não encontrada.");
  }
  
  let temporada = existeSerie.temporadas.find(t => t.numero === numeroTemporada);
  if (!temporada) {
    await Conteudo.findByIdAndUpdate(
      serieId,
      { $push: { temporadas: { numero: numeroTemporada, episodios: [] } } },
      { new: true }
    );
  }

  const serieAtualizada = await Conteudo.findById(serieId);
  const tempAtualizada = serieAtualizada.temporadas.find(t => t.numero === numeroTemporada);
  
  const existeEpisodio = tempAtualizada.episodios.find(ep => ep.titulo === dadosEpisodio.titulo || ep.numero === dadosEpisodio.numero);
  if (existeEpisodio) {
    throw new Error(`O episódio com título "${dadosEpisodio.titulo}" ou número ${dadosEpisodio.numero} já foi cadastrado na Temporada ${numeroTemporada}.`);
  }

  const resultado = await Conteudo.findOneAndUpdate(
    { _id: serieId, "temporadas.numero": numeroTemporada },
    { $push: { "temporadas.$.episodios": dadosEpisodio } },
    { new: true }
  );

  return resultado;
}

  // Deletar conteúdo por ID
  async deletarConteudo(id) {
    const deletado = await Conteudo.findByIdAndDelete(id);
    if (!deletado) {
      throw new Error("Erro ao deletar conteúdo.");
    }

    return deletado;
  }
  // Deletar episódio de uma temporada de uma série
  async deletarEpisodio(serieId, numeroTemporada, episodioId) {
    const deletado = await Conteudo.findOneAndUpdate(
      { _id: serieId, "temporadas.numero": numeroTemporada },
      { $pull: { "temporadas.$.episodios": { _id: episodioId } } },
      { new: true }
    );
    if (!deletado) {
      throw new Error("Série ou temporada não encontrada.");
    }
    return deletado;
  }

  // Atualizar Conteúdo
  async atualizarConteudo(id, dados) {
    const atualizado = await Conteudo.findByIdAndUpdate(id, dados, { new: true });
    if (!atualizado) {
      throw new Error("Conteúdo não encontrado.");
    }
    return atualizado;
  }

  // Atualizar Episódio
  async atualizarEpisodio(serieId, numeroTemporada, episodioId, dados) {
    const query = { _id: serieId, "temporadas.numero": numeroTemporada, "temporadas.episodios._id": episodioId };
    
    // Preparar objeto de $set para o episódio aninhado
    const setObj = {};
    for (const key in dados) {
      setObj[`temporadas.$[temp].episodios.$[ep].${key}`] = dados[key];
    }

    const atualizado = await Conteudo.findOneAndUpdate(
      query,
      { $set: setObj },
      { 
        new: true,
        arrayFilters: [{ "temp.numero": numeroTemporada }, { "ep._id": episodioId }]
      }
    );

    if (!atualizado) {
      throw new Error("Série, temporada ou episódio não encontrados.");
    }
    return atualizado;
  }
}

module.exports = new ConteudoService();