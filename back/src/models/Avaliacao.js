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
  nome_usuario: { 
    type: String, 
    required: true 
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

AvaliacaoSchema.index({ usuarioId: 1, conteudoId: 1 }, { unique: true });

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema);