const express = require("express");
const routes = express.Router();
const UsuarioController = require("../controller/UsuarioController");
const auth = require("../middleware/auth");

routes.post("/usuarios", UsuarioController.criarUsuario);
routes.post("/login", UsuarioController.login);
routes.get("/usuarios/me", auth, UsuarioController.getUsuarioById);
routes.patch("/usuarios/changeprofile", auth, UsuarioController.atualizarPerfil); 
routes.post("/usuarios/assinar", auth, UsuarioController.atualizarAssinatura); 
routes.patch("/usuarios/lista", auth, UsuarioController.addConteudoWishlist);
routes.delete("/usuarios/lista", auth, UsuarioController.deletaConteudoWishlist);

module.exports = routes;