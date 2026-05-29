const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true, select: false},
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
  //assinatura antiga, para referência futura. A prática atual é criar um modelo separado para Assinatura, mas mantive esse campo aqui para facilitar a transição e evitar perda de dados durante o desenvolvimento
  /* assinatura: {
    tipo_plano: String,     // Ex: "Premium", "Basic"
    tipo_pagamento: String, // Ex: "Credito", "Pix"
    status: { type: String, default: 'inativo' }, // Ex: "Ativo", "Pendente"
    data_inicio: Date,
    data_vencimento: Date
  } */
assinatura: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Assinatura",
  default: null
  /* plano_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plano' }, // Referência ao plano contratado
  tipo_plano: String,     // Ex: "Premium", "Basic" - para facilitar consultas rápidas, mesmo com a referência ao plano
  limite_perfis: { type: Number, default: 1 },
   // Limite de perfis permitido pelo plano, para controle interno
  tipo_pagamento: String, // Ex: "Credito", "Pix"
  status: { type: String, default: 'inativo' }, // Ex: "Ativo", "Pendente"
  data_inicio: Date,
  data_vencimento: Date */
}



}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);