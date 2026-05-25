const crypto = require('crypto');

/**
 * Gera uma assinatura segura para upload direto ao Cloudinary (Padrão Atualizado)
 */
const generateCloudinarySignature = (folder = 'conteudos') => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials not configured in env');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  
  // Apenas estes parâmetros DEVEM ser assinados para um upload básico em pasta
  const paramsToSign = {
    folder: folder,
    timestamp: timestamp,
  };

  // 1. Ordena as chaves alfabeticamente e cria a string "chave=valor"
  const paramsStr = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');

  // 2. No padrão do Cloudinary, você concatena a string dos parâmetros DIRETO com o apiSecret (sem sinais de união)
  const stringToSign = paramsStr + apiSecret;

  // 3. Gera o hash SHA-256 (ou SHA-1 se o seu painel do Cloudinary for antigo, mas SHA-256 é o atual)
  const signature = crypto
    .createHash('sha256')
    .update(stringToSign)
    .digest('hex');

  // Retorna os dados para o front-end. 
  // O front vai precisar de TODOS esses campos para enviar na requisição de upload.
  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
  };
};

module.exports = { generateCloudinarySignature };