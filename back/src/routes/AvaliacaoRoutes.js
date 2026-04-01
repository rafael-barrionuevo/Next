const express = require("express");
const routes = express.Router();
const AvaliacaoController = require('../controller/AvaliacaoController');

routes.get('/conteudos/:conteudoId/avaliacoes', AvaliacaoController.listarAvaliacoes);
routes.post('/avaliacoes', AvaliacaoController.criarAvaliacao);
routes.patch('/avaliacoes/:id', AvaliacaoController.alterarAvaliacao);
routes.delete('/avaliacoes/:id', AvaliacaoController.deletarAvaliacao);

module.exports = routes;