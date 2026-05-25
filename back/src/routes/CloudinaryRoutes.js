const express = require('express');

// MUDOU AQUI: Remova as chaves { } se o seu middleware exporta direto a função
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const CloudinaryController = require('../controller/CloudinaryController');
const router = express.Router();

/**
 * GET /api/upload-signature
 * Retorna a assinatura segura para upload ao Cloudinary
 * Apenas admins podem usar
 */
router.get("/api/upload-signature", auth, adminAuth, CloudinaryController.getUploadSignature);

module.exports = router;