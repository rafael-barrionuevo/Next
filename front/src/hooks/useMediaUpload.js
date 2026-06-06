import { useState, useRef } from 'react';

/**
 * Hook reutilizável para upload de imagem e vídeo via Cloudinary.
 * Usado nos modais de conteúdo e episódio.
 *
 * @param {Function} uploadFn - Função de upload do useCloudinaryUpload
 * @param {object} options - { initialImageUrl }
 */
export function useMediaUpload(uploadFn, options = {}) {
  const { initialImageUrl = null } = options;

  // Imagem
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(initialImageUrl);
  const [imgPreview, setImgPreview] = useState(initialImageUrl);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Vídeo
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoFileInputRef = useRef(null);

  // Erro compartilhado
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgUrl(null);
      setErrorMsg('');
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imgFile) {
      setErrorMsg('Selecione uma imagem antes de enviar.');
      return;
    }
    try {
      setUploadingImg(true);
      setErrorMsg('');
      const result = await uploadFn(imgFile);
      setImgUrl(result.url);
      setImgPreview(result.url);
    } catch (err) {
      setErrorMsg(err.message || 'Falha ao enviar a imagem');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleVideoFileSelect = async (e, setUrlVideo) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingVideo(true);
      setErrorMsg('');
      const result = await uploadFn(file);
      setUrlVideo(result.url);
    } catch (err) {
      setErrorMsg(err.message || 'Falha ao enviar o vídeo');
    } finally {
      setUploadingVideo(false);
    }
  };

  const triggerVideoFileSelect = () => {
    videoFileInputRef.current?.click();
  };

  return {
    imgFile, imgUrl, imgPreview,
    uploadingImg, uploadingVideo,
    errorMsg, setErrorMsg,
    videoFileInputRef,
    handleImageChange,
    handleImageUpload,
    handleVideoFileSelect,
    triggerVideoFileSelect,
  };
}
