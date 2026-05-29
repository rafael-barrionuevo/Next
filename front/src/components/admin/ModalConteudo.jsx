import { useState } from 'react';
import { listarConteudos, criarConteudo, atualizarConteudo } from '../../store/contentSlice';
import { IoAddCircleOutline } from 'react-icons/io5';
import { getImageUrl } from '../../utils/getImageUrl';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import Button from '../button';

export default function ModalConteudo({ modal, setModal, dispatch, upload }) {
  const { mode, data, type } = modal;

  const [titulo, setTitulo] = useState(data?.titulo || '');
  const [genero, setGenero] = useState(data?.genero ? data.genero.join(', ') : '');
  const [ano, setAno] = useState(data?.ano || '');
  const [sinopse, setSinopse] = useState(data?.sinopse || '');
  const [duracao, setDuracao] = useState(data?.filme?.duracao || '');
  const [urlVideo, setUrlVideo] = useState(data?.filme?.url_filme || '');

  const {
    imgFile, imgUrl, imgPreview,
    uploadingImg, uploadingVideo,
    errorMsg,
    videoFileInputRef,
    handleImageChange,
    handleImageUpload,
    handleVideoFileSelect,
    triggerVideoFileSelect,
  } = useMediaUpload(upload, {
    initialImageUrl: data?.img_capa ? getImageUrl(data.img_capa) : null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("tipo_midia", type);
    formData.append("genero", genero);
    formData.append("sinopse", sinopse);
    formData.append("ano", ano);
    if (type === "filme") {
      formData.append("duracao", duracao);
      formData.append("url_filme", urlVideo);
    }

    if (imgUrl) {
      formData.append("img_capa", imgUrl);
    } else if (imgFile) {
      formData.append("img_capa", imgFile);
    }

    const action = mode === 'create' ? criarConteudo(formData) : atualizarConteudo({ id: data._id, formData });

    dispatch(action).unwrap()
      .then(() => {
        dispatch(listarConteudos());
        setModal({ isOpen: false });
      })
      .catch(err => alert("Erro: " + err));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-2xl font-bold">{mode === 'create' ? `Adicionar ${type === 'filme' ? 'Filme' : 'Série'}` : `Editar ${type === 'filme' ? 'Filme' : 'Série'} - ${data?.titulo}`}</h2>
          <button onClick={() => setModal({ isOpen: false })} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-y-auto p-6 md:flex-row">
          {/* Lado esquerdo: Selecionador de Imagem */}
          <div className="flex w-full shrink-0 flex-col gap-2 md:w-1/3">
            <label className="text-sm font-bold text-gray-400">Capa do Conteúdo</label>
            <div className="group relative flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-purple-400/50 bg-black/50 transition-colors hover:border-purple-500">
              {imgPreview ? (
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center text-gray-500 group-hover:text-purple-400">
                  <IoAddCircleOutline className="text-5xl mb-2" />
                  <span className="text-sm font-bold">Escolher Imagem</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={handleImageUpload} disabled={!imgFile || uploadingImg} className="w-full sm:w-auto max-w-[180px] py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors disabled:opacity-50">
                {uploadingImg ? 'Enviando...' : 'Upload imagem'}
              </button>
              {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
              {imgUrl && !uploadingImg && <p className="text-xs text-green-400">Imagem enviada: Cloudinary pronta para salvar</p>}
            </div>
          </div>

          {/* Lado direito: Campos */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-400 mb-1">Título</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required className="w-full p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-400 mb-1">Ano de Lançamento</label>
                <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} required className="w-full p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-400 mb-1">Gêneros (separados por vírgula)</label>
                <input type="text" value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            {type === "filme" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-400 mb-1">Duração</label>
                  <input type="text" value={duracao} onChange={(e) => setDuracao(e.target.value)} className="w-full p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-400 mb-1">URL do Vídeo</label>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                    <input type="text" value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} className="w-full p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
                    <button type="button" onClick={triggerVideoFileSelect} disabled={uploadingVideo} className="w-full sm:w-auto max-w-[160px] px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors disabled:opacity-50">
                      {uploadingVideo ? 'Enviando...' : 'Subir arquivo'}
                    </button>
                  </div>
                  <input ref={videoFileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoFileSelect(e, setUrlVideo)} />
                  {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
                  {urlVideo && urlVideo.startsWith('http') && !uploadingVideo && <p className="text-xs text-green-400">URL pronta para salvar</p>}
                </div>
              </div>
            )}

            <div className="flex flex-col flex-1">
              <label className="text-sm font-bold text-gray-400 mb-1">Sinopse</label>
              <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} className="w-full p-3 flex-1 min-h-[120px] rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            </div>

            <div className="pt-4 flex justify-end gap-3 mt-auto">
              <Button type="button" onClick={() => setModal({ isOpen: false })} className="bg-transparent border border-white/20 hover:bg-white/5 py-2 px-6 rounded-xl">Cancelar</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-500 py-2 px-6 rounded-xl font-bold shadow-lg shadow-purple-500/20">{mode === 'create' ? 'Criar' : 'Salvar Alterações'}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
