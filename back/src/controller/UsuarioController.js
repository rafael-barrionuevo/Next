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
        role: 'user',
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

  // PATCH /usuarios/changeprofile (Atualizar Perfil)
  async atualizarPerfil(req, res) {
    try {
      const id = req.id;
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

  
  // POST /usuarios/perfis (Adicionar novo perfil à conta)
  async adicionarPerfil(req, res) {
    try {
      const id = req.id; 
      const { nome, avatar } = req.body;

      if (!nome || !avatar) {
        return res.status(400).json({ erro: "Nome e avatar são obrigatórios." });
      }

      const usuarioAtualizado = await UsuarioService.adicionarPerfil(id, { nome, avatar });

      return res.status(201).json({ 
        message: "Perfil criado com sucesso!", 
        perfis: usuarioAtualizado.perfis 
      });
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }

  // PATCH /usuarios/perfis/:perfilId (Editar perfil existente)
  async editarPerfil(req, res) {
    try {
      const userId = req.id; 
      const perfilId = req.params.perfilId; 
      const { nome, avatar } = req.body;

      const usuarioAtualizado = await UsuarioService.editarPerfil(userId, perfilId, { nome, avatar });

      return res.status(200).json({ 
        message: "Perfil atualizado com sucesso!", 
        perfis: usuarioAtualizado.perfis 
      });
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }
  // POST /usuarios/assinar (Lógica de Assinatura)
  // Melhorar a logica de assinatura depois, 
  // talvez um webhook de pagamento, pedir email e nome do usuário para o pagamento, etc
  async atualizarAssinatura(req, res) {
    try {
      const id = req.params.id;
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

  // GET /usuarios/me (Obter dados do usuário autenticado)
  async getUsuarioById(req, res) {
    try {
      const user = await UsuarioService.getUsuarioById(req.id);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // PATCH /usuarios/lista
  async addConteudoWishlist(req, res) {
    try {
      const id = req.id; 
      const { conteudoId } = req.body;
      const updatedUser = await UsuarioService.addConteudoWishlist(id, conteudoId);
      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE /usuarios/lista
  async deletaConteudoWishlist(req, res) {
    try {
      const id = req.id;
      const { conteudoId } = req.body;

      const result = await UsuarioService.deletaConteudoWishlist(id, conteudoId);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
      }

      const result = await UsuarioService.login(email, senha);
      
      return res.json(result);
    } catch (e) {
      return res.status(401).json({ erro: e.message });
    }
  }
}

module.exports = new UsuarioController();
