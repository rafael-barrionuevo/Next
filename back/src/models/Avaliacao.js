const mongoose = require('mongoose');

const AvaliacaoSchema = new mongoose.Schema({
  conteudoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conteudo', 
    required: true 
  },
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  // ID do perfil (subdocument) que fez a avaliação — cada perfil pode avaliar de forma independente
  perfilId: {
    type: String,
    default: null
  },
  nome_usuario: { 
    type: String, 
    required: true 
  },
  // Nome do perfil (pode diferir do nome do usuário)
  nome_perfil: {
    type: String,
    default: null
  },
  nota: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} não é um número inteiro. Use apenas valores de 0 a 10.'
    }
  },
  comentario: { 
    type: String, 
    maxLength: 500 
  },
  data: { 
    type: Date, 
    default: Date.now 
  }
});

// Unicidade por perfil: mesmo usuário com perfis diferentes pode avaliar separadamente
AvaliacaoSchema.index({ usuarioId: 1, perfilId: 1, conteudoId: 1 }, { unique: true });

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema);