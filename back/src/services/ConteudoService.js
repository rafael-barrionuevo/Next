const Conteudo = require("../models/Conteudo");

class ConteudoService {
  // Listar todos os conteúdos
  async listarConteudos() {
    return await Conteudo.find(); 
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
  
  const existeEpisodio = tempAtualizada.episodios.find(ep => ep.titulo === dadosEpisodio.titulo);
  if (existeEpisodio) {
    throw new Error(`O episódio "${dadosEpisodio.titulo}" já foi cadastrado na Temporada ${numeroTemporada}.`);
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
}

module.exports = new ConteudoService();