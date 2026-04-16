const express = require("express");
const routes = express.Router();
const UsuarioController = require("../controller/UsuarioController");
const auth = require("../middleware/auth");

routes.post("/usuarios", UsuarioController.criarUsuario);
routes.post("/login", UsuarioController.login);
routes.get("/usuarios/me", auth, UsuarioController.getUsuarioById);
routes.patch("/usuarios/changeprofile", auth, UsuarioController.atualizarPerfil); 
routes.post("/usuarios/:id/assinar", UsuarioController.atualizarAssinatura); 
routes.patch("/usuarios/lista", auth, UsuarioController.addConteudoWishlist);
routes.delete("/usuarios/lista", auth, UsuarioController.deletaConteudoWishlist);
routes.post("/usuarios/perfis", auth, UsuarioController.adicionarPerfil);
routes.patch("/usuarios/perfis/:perfilId", auth, UsuarioController.editarPerfil);

module.exports = routes;
