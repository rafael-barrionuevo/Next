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
    const ExisteTemporada = existeSerie.temporadas.find(temporada => temporada.numero === numeroTemporada);
    if (!ExisteTemporada) {
      throw new Error("Temporada não encontrada.");
    }
    const existeEpisodio = ExisteTemporada.episodios.find(ep => ep.titulo === dadosEpisodio.titulo); 
    /*|| (dadosEpisodio._id && ep._id.equals(dadosEpisodio._id) */
    if (existeEpisodio) {
      throw new Error(`O episódio "${dadosEpisodio.titulo}" já foi cadastrado.`);
    }
    
    const adicionaEpisodio = await Conteudo.findOneAndUpdate(
      { _id: serieId, "temporadas.numero": numeroTemporada },
      { $push: { "temporadas.$.episodios": dadosEpisodio } },
      { new: true }
    );

    return adicionaEpisodio;
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