const express = require("express");
const routes = express.Router();
const ConteudoController = require("../controller/ConteudoController");

routes.get("/conteudos", ConteudoController.listarConteudos);
routes.post("/conteudos", ConteudoController.criarConteudo);
routes.delete("/conteudos/:id", ConteudoController.deletarConteudo);
routes.patch("/conteudos/:id/episodios", ConteudoController.adicionarEpisodio);
routes.delete("/conteudos/:id/episodios", ConteudoController.deletarEpisodio);

module.exports = routes;