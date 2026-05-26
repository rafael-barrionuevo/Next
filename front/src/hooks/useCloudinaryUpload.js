import { useState } from 'react';
import { uploadToCloudinary } from '../services/cloudinaryService';

/**
 * Hook para fazer upload de arquivos para Cloudinary
 * @param {string} folder - 'conteudos' ou 'usuarios' (padrão: 'conteudos')
 */
export const useCloudinaryUpload = (folder = 'conteudos') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const upload = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // Valida se é um arquivo
      if (!file || !(file instanceof File)) {
        throw new Error('Por favor, selecione um arquivo válido');
      }

      // Valida o tamanho (máx 500MB)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande (máximo 500MB)');
      }

      // Tipos permitidos
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/quicktime',
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          'Tipo de arquivo não permitido. Use: JPG, PNG, GIF, WebP, MP4, WebM ou MOV'
        );
      }

      // Simula progresso (Cloudinary não fornece progresso em tempo real via FormData)
      setProgress(30);

      // Faz o upload
      const result = await uploadToCloudinary(file, folder);

      setProgress(100);
      setUploadedFile(result);

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer upload';
      setError(errorMessage);
      console.error('Erro no upload:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setProgress(0);
    setUploadedFile(null);
  };

  return {
    upload,
    loading,
    error,
    progress,
    uploadedFile,
    reset,
  };
};
