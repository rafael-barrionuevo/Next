const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  foto: { type: String },
  data_nascimento: Date,
  role: { type: String, default: 'user' },
  lista_desejos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conteudo' }], // Array que referencia objetos de Conteudo
  
  perfis: [
  {
    nome: { type: String, required: true },
    avatar: { type: String, required: true }
  }
],

  assinatura: {
    tipo_plano: String,     // Ex: "Premium", "Basic"
    tipo_pagamento: String, // Ex: "Credito", "Pix"
    status: { type: String, default: 'inativo' }, // Ex: "Ativo", "Pendente"
    data_inicio: Date,
    data_vencimento: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);