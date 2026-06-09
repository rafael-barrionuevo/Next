const express = require("express");
const routes = express.Router();
const ConteudoController = require("../controller/ConteudoController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/adminAuth");

routes.get("/conteudos/pesquisa", ConteudoController.pesquisarConteudos);
routes.get("/conteudos", ConteudoController.listarConteudos);
routes.post("/conteudos", auth, authAdmin, ConteudoController.criarConteudo);
routes.patch("/conteudos/:id", auth, authAdmin, ConteudoController.atualizarConteudo);
routes.delete("/conteudos/:id", auth, authAdmin, ConteudoController.deletarConteudo);
routes.patch("/conteudos/:id/episodios", auth, authAdmin, ConteudoController.adicionarEpisodio);
routes.patch("/conteudos/:id/episodios/:episodioId", auth, authAdmin, ConteudoController.atualizarEpisodio);
routes.delete("/conteudos/:id/episodios", auth, authAdmin, ConteudoController.deletarEpisodio);

module.exports = routes;