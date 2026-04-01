const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
  async criarUsuario(req, res) {
    try {
      const { nome, sobrenome, email, senha, data_nascimento } = req.body
      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
      }
      if (data_nascimento) {
        const data = new Date(data_nascimento);
        // isNaN(data) verifica se a string enviada resultou em uma "Invalid Date"
        if (isNaN(data.getTime())) {
          return res.status(400).json({ erro: "Data de nascimento inválida." });
        }
      }
      let imagePath = null;

      if (req.files && req.files.foto) {
        const foto = req.files.foto;
        const caminho = `uploads/${Date.now()}_${foto.name}`;
        await foto.mv(caminho);
        imagePath = `/${caminho}`;
      }

      const userData = {
        nome,
        sobrenome,
        email,
        senha,
        data_nascimento,
        foto: imagePath
      };
      
      const novoUsuario = await UsuarioService.criarUsuario(userData);

      return res.status(201).json({ 
        message: "Usuário criado com sucesso!", 
        user: novoUsuario 
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  // PATCH /usuarios/:id (Atualizar Perfil)
  async atualizarPerfil(req, res) {
    try {
      const { id } = req.params;
      const { nome, 
        sobrenome, 
        data_nascimento } = req.body || {};
      if(nome && nome.trim() === "") {
        return res.status(400).json({ erro: "O nome não pode ser vazio." });
      }
      if (data_nascimento) {
        const data = new Date(data_nascimento);
        if (isNaN(data.getTime())) {
          return res.status(400).json({ erro: "Data de nascimento inválida." });
        }
      }
      let imagePath = null;
      if (req.files && req.files.foto) {
        const foto = req.files.foto;
        const caminho = `uploads/${Date.now()}_${foto.name}`;
        await foto.mv(caminho);
        imagePath = `/${caminho}`;
      }

      const dadosParaAtualizar = {
        nome,
        sobrenome,
        data_nascimento,
        ...(imagePath && { foto: imagePath }) //foto nova ou undefined
      };

      const usuario = await UsuarioService.atualizarPerfil(id, dadosParaAtualizar);
      return res.json({ message: "Perfil atualizado!", user: usuario });
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }

  // POST /usuarios/:id/assinar (Lógica de Assinatura)
  // Melhorar a logica de assinatura depois, 
  // talvez um webhook de pagamento, pedir email e nome do usuário para o pagamento, etc
  async atualizarAssinatura(req, res) {
    try {
      const { id } = req.params;
      const { tipo_plano, tipo_pagamento } = req.body;

      if (!tipo_plano || !tipo_pagamento) {
        throw new Error("Tipo de plano e pagamento são obrigatórios.");
      }

      const usuarioAtivo = await UsuarioService.atualizarAssinatura(id, {
        tipo_plano,
        tipo_pagamento
      });

      return res.json({ message: "Assinatura ativada!", user: usuarioAtivo });
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }

  // GET /usuarios/:id
  async getUsuarioById(req, res) {
    try {
      const user = await UsuarioService.getUsuarioById(req.params.id);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // PATCH /usuarios/:id/lista
  async addConteudoWishlist(req, res) {
    try {
      const { id } = req.params;
      const { conteudoId } = req.body;
      const updatedUser = await UsuarioService.addConteudoWishlist(id, conteudoId);
      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /usuarios/:id/lista
  async deletaConteudoWishlist(req, res) {
    try {
      const { id } = req.params;
      const { conteudoId } = req.body;

      const result = await UsuarioService.deletaConteudoWishlist(id, conteudoId);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

}

module.exports = new UsuarioController();