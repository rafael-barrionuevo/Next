const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsuarioService {
  async criarUsuario(userData) {
    const existeEmail = await Usuario.findOne({ email: userData.email });
    if (existeEmail) {
      throw new Error("Erro ao criar usuário."); // Não expor detalhes para segurança
    }
    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(userData.senha, salt);

    const novoUsuario = await Usuario.create({
      ...userData,
      senha: senhaHash,
      assinatura: { status: 'inativo' },
      lista_desejos: []
    });
    return novoUsuario;
  }

  async atualizarPerfil(userId, novosDados) {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      userId, 
      { $set: novosDados }, 
      { new: true }
    );
    if (!usuarioAtualizado){
      throw new Error("Usuário não encontrado.");
    }

    if (novosDados.nome) {
      const Avaliacao = require("../models/Avaliacao"); // Local, muda o que precisa e perde a referência
      await Avaliacao.updateMany(
        { usuarioId: userId }, 
        { $set: { nome_usuario: novosDados.nome } }
      );
    }

    return usuarioAtualizado;
  }

  async getUsuarioById(userId) {
    const existeUsuario = await Usuario.findById(userId).populate("lista_desejos", "titulo img_capa");
    if (!existeUsuario) {
      throw new Error("Usuário não encontrado.");
    }
    return existeUsuario;
  }

  async addConteudoWishlist(userId, conteudoId) {
    const existeUsuario = await Usuario.findById(userId);
    if (!existeUsuario) {
      throw new Error("Usuário não encontrado.");
    }

    const existeConteudoLista = existeUsuario.lista_desejos.some(
      (id) => id.equals(conteudoId)
    );
    if (existeConteudoLista) {
      throw new Error("Este conteúdo já está na sua lista de desejos!");
    }

    const updateLista = await Usuario.findByIdAndUpdate(
      userId,
      { $addToSet: { lista_desejos: conteudoId } }, 
      { new: true }
    ).populate("lista_desejos", "titulo img_capa");

    return updateLista;
  }
  
  async deletaConteudoWishlist(userId, conteudoId) {
    const usuarioExistente = await Usuario.findById(userId);
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.");
    }
    const estaNaLista = usuarioExistente.lista_desejos.some(
      (id) => id.equals(conteudoId)
    );
    if (!estaNaLista) {
      throw new Error("Este conteúdo não está na sua lista de desejos.");
    }

    const deletaDaLista = await Usuario.findByIdAndUpdate(
      userId,
      { $pull: { lista_desejos: conteudoId } }, 
      { new: true }
    ).populate("lista_desejos", "titulo img_capa");

    return deletaDaLista;
  }

  async atualizarAssinatura(userId, dadosPlano) {
    const data_inicio = new Date(); // Data atual como início da assinatura. Numa renovação, a prática irá mudar
    const data_vencimento = new Date();
    data_vencimento.setDate(data_inicio.getDate() + 30); // +1 mês de acesso

    const user = await Usuario.findByIdAndUpdate(
      userId,
      {
        assinatura: {
          tipo_plano: dadosPlano.tipo_plano,
          tipo_pagamento: dadosPlano.tipo_pagamento,
          status: 'ativo',
          data_inicio,
          data_vencimento
        }
      },
      { new: true }
    );

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return user;
  }

  async login(email, senha) {
    const user = await Usuario.findOne({ email });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const compara = bcrypt.compareSync(senha, user.senha);
    if (!compara) {
      throw new Error("E-mail ou senha incorretos.");
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "24h" });

    return { token, usuario: { nome: user.nome, email: user.email } };
  }
}

module.exports = new UsuarioService();
