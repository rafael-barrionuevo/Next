const express = require("express");
const routes = express.Router();
const AvaliacaoController = require('../controller/AvaliacaoController');
const auth = require("../middleware/auth");

routes.get('/conteudos/:conteudoId/avaliacoes', AvaliacaoController.listarAvaliacoes);
routes.post('/avaliacoes', auth, AvaliacaoController.criarAvaliacao);
routes.patch('/avaliacoes/:id', auth, AvaliacaoController.alterarAvaliacao);
routes.delete('/avaliacoes/:id', auth, AvaliacaoController.deletarAvaliacao);

module.exports = routes;