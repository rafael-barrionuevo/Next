const mongoose = require('mongoose');

const EpisodioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  img_ep: String,
  url_ep: { type: String, required: true }
});

const ConteudoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tipo_midia: { type: String, enum: ['filme', 'serie'], required: true },
  genero: [String],
  sinopse: String,
  img_capa: String,
  ano: Number,
  classificacao: String,

  filme: {
    duracao: String,
    descricao: String,
    url_filme: String
  },

  temporadas: [{
    _id: false, // Não é necessário, pois o número da temporada é único
    numero: Number,
    descricao: String,
    episodios: [EpisodioSchema] // Array de episódios para cada temporada
  }]
}, { timestamps: true });

module.exports = mongoose.model('Conteudo', ConteudoSchema);