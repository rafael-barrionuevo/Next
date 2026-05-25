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

/**
 * Faz upload de arquivo para Cloudinary de forma segura
 * @param {File} file - O arquivo a ser enviado
 * @param {string} folder - Pasta no Cloudinary ('conteudos' ou 'usuarios')
 * @returns {Promise} - {public_id, secure_url, resource_type, ...}
 */
export const uploadToCloudinary = async (file, folder = 'conteudos') => {
  try {
    const signatureData = await getUploadSignature(folder);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('folder', folder);
    formData.append('resource_type', 'auto');

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;
    const response = await axios.post(cloudinaryUrl, formData, {
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
    console.error('Erro no upload:', error);
    throw new Error(error.response?.data?.error?.message || 'Erro ao fazer upload');
  }
};
