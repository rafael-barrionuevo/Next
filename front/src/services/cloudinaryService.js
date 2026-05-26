import axios from 'axios';
import api from './api';

/**
 * Obtém a assinatura segura do backend para fazer upload ao Cloudinary
 * @param {string} folder - 'conteudos' ou 'usuarios'
 * @returns {Promise} - {timestamp, signature, apiKey, cloudName, folder}
 */
export const getUploadSignature = async (folder = 'conteudos') => {
  try {
    const response = await api.get('/api/upload-signature', {
      params: { folder }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter assinatura:', error);
    throw new Error('Falha ao obter permissão de upload');
  }
};

export const uploadToCloudinary = async (file, folder = 'conteudos') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Envia o arquivo para o próprio backend, que fará a compressão antes de salvar no Cloudinary
    const response = await api.post('/api/upload-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      public_id: response.data.public_id,
      url: response.data.secure_url,
      resource_type: response.data.resource_type,
      format: response.data.format,
      width: response.data.width,
      height: response.data.height,
      bytes: response.data.bytes,
    };
  } catch (error) {
    console.error('Erro no upload via backend:', error);
    throw new Error(error.response?.data?.error || 'Erro ao fazer upload pelo backend');
  }
};
