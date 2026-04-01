const express = require("express");
const routes = express.Router();
const UsuarioController = require("../controller/UsuarioController");

routes.post("/usuarios", UsuarioController.criarUsuario);
routes.get("/usuarios/:id", UsuarioController.getUsuarioById);
routes.patch("/usuarios/:id", UsuarioController.atualizarPerfil); 
routes.post("/usuarios/:id/assinar", UsuarioController.atualizarAssinatura); 
routes.patch("/usuarios/:id/lista", UsuarioController.addConteudoWishlist);
routes.delete("/usuarios/:id/lista", UsuarioController.deletaConteudoWishlist);

module.exports = routes;