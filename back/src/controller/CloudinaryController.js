const { generateCloudinarySignature } = require('../services/CloudinaryService');

const CloudinaryController = {
  async getUploadSignature(req, res) {
    try {
      const folder = req.query.folder || 'conteudos';
      const signature = generateCloudinarySignature(folder);
        
      res.json({
        success: true,
        ...signature,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
};

module.exports = CloudinaryController;