const express = require("express");
const routes = express.Router();
const ConteudoController = require("../controller/ConteudoController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/adminAuth");

routes.get("/conteudos", ConteudoController.listarConteudos);
routes.post("/conteudos", auth, authAdmin, ConteudoController.criarConteudo);
routes.delete("/conteudos/:id", auth, authAdmin, ConteudoController.deletarConteudo);
routes.patch("/conteudos/:id/episodios", auth, authAdmin, ConteudoController.adicionarEpisodio);
routes.delete("/conteudos/:id/episodios", auth, authAdmin, ConteudoController.deletarEpisodio);

module.exports = routes;