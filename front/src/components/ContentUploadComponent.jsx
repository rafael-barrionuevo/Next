import { useState } from 'react';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

/**
 * Componente de exemplo para upload de conteúdo (imagem/vídeo)
 * Use este padrão na sua tela de CRUD do admin
 */
export const ContentUploadComponent = () => {
  const { upload, loading, error, progress, uploadedFile } = useCloudinaryUpload('conteudos');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo');
      return;
    }

    try {
      const result = await upload(selectedFile);
      console.log('Upload bem-sucedido:', result);
      // Aqui você pode:
      // - Salvar a URL no banco de dados
      // - Atualizar o formulário
      // - Recarregar a lista de conteúdos
      // Exemplo:
      // saveContentToDatabase({
      //   title: formData.title,
      //   imageUrl: result.url,
      //   cloudinaryId: result.public_id,
      // });
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
    }
  };

  return (
    <div className="upload-container p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload de Conteúdo</h2>

      {/* Input de arquivo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione uma imagem ou vídeo
        </label>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
          accept="image/*,video/*"
        />
      </div>

      {/* Exibe arquivo selecionado */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-600">
            📁 <strong>{selectedFile.name}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      )}

      {/* Barra de progresso */}
      {loading && progress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{progress}%</p>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-md border border-red-200">
          <p className="text-sm text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Upload bem-sucedido */}
      {uploadedFile && (
        <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-sm text-green-700">✅ Upload realizado com sucesso!</p>
          <p className="text-xs text-gray-600 mt-2">
            ID: <code className="bg-gray-100 px-2 py-1">{uploadedFile.public_id}</code>
          </p>
          {uploadedFile.resource_type === 'image' && (
            <img
              src={uploadedFile.url}
              alt="Preview"
              className="mt-3 max-w-xs rounded-md"
            />
          )}
          {uploadedFile.resource_type === 'video' && (
            <video
              src={uploadedFile.url}
              controls
              className="mt-3 max-w-xs rounded-md"
            />
          )}
        </div>
      )}

      {/* Botão de upload */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
          font-medium hover:bg-blue-700 disabled:bg-gray-400
          disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '⏳ Fazendo upload...' : '📤 Fazer Upload'}
      </button>
    </div>
  );
};
