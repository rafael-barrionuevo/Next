import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listarConteudos, criarConteudo, atualizarConteudo, adicionarEpisodio, atualizarEpisodio } from '../store/contentSlice';
import api from '../services/api';
import NavBar from '../components/NavBar';
import { IoAddCircleOutline, IoTrashOutline, IoChevronDownOutline, IoChevronUpOutline, IoPencilOutline } from "react-icons/io5";
import { getImageUrl } from "../utils/getImageUrl";
import Button from "../components/button";
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

export default function AdminCatalogo() {
  const { upload } = useCloudinaryUpload('conteudos');
  const dispatch = useDispatch();
  const { items: conteudos, status } = useSelector(state => state.content);

  const [activeTab, setActiveTab] = useState('filmes');
  const [expandedSerie, setExpandedSerie] = useState(null);


  const [modalConteudo, setModalConteudo] = useState({ isOpen: false, mode: 'create', data: null, type: 'filme' });
  const [modalEpisodio, setModalEpisodio] = useState({ isOpen: false, mode: 'create', data: null, serieId: null, tempNumero: null });

  useEffect(() => {
    dispatch(listarConteudos());
  }, [dispatch]);

  const filmes = conteudos.filter(c => c.tipo_midia === 'filme');
  const series = conteudos.filter(c => c.tipo_midia === 'serie');

  const handleDeleteConteudo = async (id, titulo) => {
    if (window.confirm(`Deletar "${titulo}" e todos os seus dados?`)) {
      try {
        await api.delete(`/conteudos/${id}`);
        dispatch(listarConteudos());
      } catch (err) {
        alert("Erro: " + (err.response?.data?.error || "Erro interno"));
      }
    }
  };

  const handleDeleteEpisodio = async (serieId, numTemp, epId, epTitulo) => {
    if (window.confirm(`Remover episódio "${epTitulo}"?`)) {
      try {
        await api.delete(`/conteudos/${serieId}/episodios`, {
          data: { numeroTemporada: numTemp, episodioId: epId }
        });
        dispatch(listarConteudos());
      } catch (err) {
        alert("Erro: " + (err.response?.data?.error || "Erro interno"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar />

      <main className="max-w-6xl mx-auto p-6 py-12">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2">Gerenciar Catálogo</h1>
            <p className="text-gray-400">Controle centralizado de filmes, séries e episódios.</p>
          </div>
        </header>

        {/* Abas */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            className={`py-3 px-6 font-bold text-lg border-b-2 transition-all ${activeTab === 'filmes' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('filmes')}
          >
            Filmes
          </button>
          <button
            className={`py-3 px-6 font-bold text-lg border-b-2 transition-all ${activeTab === 'series' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            onClick={() => setActiveTab('series')}
          >
            Séries
          </button>
        </div>

        {/* FILMES */}
        {activeTab === 'filmes' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filmes.map(filme => (
              <div key={filme._id} className="relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden bg-[#161b22] border border-white/5 hover:border-purple-500/50 transition-all">
                <img src={getImageUrl(filme.img_capa)} alt={filme.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <button onClick={() => setModalConteudo({ isOpen: true, mode: 'edit', data: filme, type: 'filme' })} className="px-4 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-500 transition-colors">Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteConteudo(filme._id, filme.titulo); }} className="px-4 py-2 bg-red-600/80 rounded-lg font-bold hover:bg-red-500 transition-colors">Deletar</button>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black to-transparent">
                  <h3 className="font-bold text-sm truncate drop-shadow-md">{filme.titulo}</h3>
                </div>
              </div>
            ))}

            {/* Card para Adicionar Filme */}
            <div
              onClick={() => setModalConteudo({ isOpen: true, mode: 'create', data: null, type: 'filme' })}
              className="aspect-[2/3] rounded-xl bg-[#161b22] border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
            >
              <IoAddCircleOutline className="text-4xl text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="text-gray-500 group-hover:text-purple-400 font-bold transition-colors">Adicionar Filme</span>
            </div>
          </div>
        )}

        {/* SÉRIES */}
        {activeTab === 'series' && (
          <div className="space-y-4">
            {/* Card para Adicionar Série */}
            <div className="flex justify-end mb-4">
              <Button onClick={() => setModalConteudo({ isOpen: true, mode: 'create', data: null, type: 'serie' })} className="bg-purple-600 hover:bg-purple-500 py-2 px-4 rounded-lg font-bold flex items-center gap-2">
                <IoAddCircleOutline className="text-xl" /> Adicionar Série
              </Button>
            </div>

            {series.map(serie => (
              <div key={serie._id} className="bg-[#161b22] border border-white/5 rounded-xl overflow-hidden transition-all">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedSerie(expandedSerie === serie._id ? null : serie._id)}
                >
                  <div className="flex items-center gap-4">
                    <img src={getImageUrl(serie.img_capa)} alt={serie.titulo} className="w-12 h-16 object-cover rounded shadow-md" />
                    <div>
                      <h3 className="text-xl font-bold">{serie.titulo}</h3>
                      <p className="text-sm text-gray-400">{serie.temporadas?.length || 0} Temporada(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalConteudo({ isOpen: true, mode: 'edit', data: serie, type: 'serie' }); }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm font-bold transition-colors"
                    >
                      Editar Série
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteConteudo(serie._id, serie.titulo); }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <IoTrashOutline size={20} />
                    </button>
                    {expandedSerie === serie._id ? <IoChevronUpOutline size={24} className="text-gray-400" /> : <IoChevronDownOutline size={24} className="text-gray-400" />}
                  </div>
                </div>

                {/* Temporadas & Episodios */}
                {expandedSerie === serie._id && (
                  <div className="bg-black/40 p-6 border-t border-white/5">
                    {/* Botão de adicionar temporada/episódio genérico */}
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-white">Episódios</h4>
                      <Button onClick={() => setModalEpisodio({ isOpen: true, mode: 'create', data: null, serieId: serie._id, tempNumero: (serie.temporadas?.[0]?.numero || 1) })} className="bg-green-600 hover:bg-green-500 py-1.5 px-4 rounded-lg text-sm font-bold flex items-center gap-2">
                        <IoAddCircleOutline className="text-lg" /> Adicionar Episódio
                      </Button>
                    </div>

                    {(!serie.temporadas || serie.temporadas.length === 0) ? (
                      <p className="text-gray-500 text-sm">Nenhuma temporada cadastrada. Adicione um episódio para criar a temporada 1.</p>
                    ) : (
                      <div className="space-y-8">
                        {serie.temporadas.map(temp => (
                          <div key={temp._id || temp.numero}>
                            <h5 className="text-md font-bold text-purple-400 mb-4 flex items-center gap-2">
                              Temporada {temp.numero}
                              <Button
                                onClick={() => setModalEpisodio({ isOpen: true, mode: 'create', data: null, serieId: serie._id, tempNumero: temp.numero })}
                                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                              >
                                + Ep
                              </Button>
                            </h5>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                              {temp.episodios.map(ep => (
                                <div key={ep._id} className="min-w-[240px] max-w-[240px] bg-[#1a1a1c] border border-white/10 rounded-xl overflow-hidden group">
                                  <div className="relative aspect-video">
                                    <img src={getImageUrl(ep.img_ep)} alt={ep.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <button onClick={() => setModalEpisodio({ isOpen: true, mode: 'edit', data: ep, serieId: serie._id, tempNumero: temp.numero })} className="p-2 bg-purple-600 rounded-full hover:bg-purple-500"><IoPencilOutline /></button>
                                      <button onClick={() => handleDeleteEpisodio(serie._id, temp.numero, ep._id, ep.titulo)} className="p-2 bg-red-600 rounded-full hover:bg-red-500"><IoTrashOutline /></button>
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <h6 className="font-bold text-sm truncate">{ep.numero} - {ep.titulo}</h6>
                                  </div>
                                </div>
                              ))}

                              {/* Card para Adicionar Episódio */}
                              <div
                                onClick={() => setModalEpisodio({ isOpen: true, mode: 'create', data: null, serieId: serie._id, tempNumero: temp.numero })}
                                className="min-w-[240px] aspect-video rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-green-500/50 hover:bg-green-900/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                              >
                                <IoAddCircleOutline className="text-3xl text-gray-500 group-hover:text-green-400 transition-colors" />
                                <span className="text-sm text-gray-500 group-hover:text-green-400 font-bold transition-colors">Adicionar Episódio</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAIS */}
      {modalConteudo.isOpen && <ModalConteudo modal={modalConteudo} setModal={setModalConteudo} dispatch={dispatch} upload={upload} />}
      {modalEpisodio.isOpen && <ModalEpisodio modal={modalEpisodio} setModal={setModalEpisodio} dispatch={dispatch} upload={upload} />}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(147,51,234,0.5); }
      `}</style>
    </div>
  );
}

// ------------------- MODAL CONTEUDO (Filme/Série) -------------------
function ModalConteudo({ modal, setModal, dispatch, upload }) {
  const { mode, data, type } = modal;

  const [titulo, setTitulo] = useState(data?.titulo || '');
  const [genero, setGenero] = useState(data?.genero ? data.genero.join(', ') : '');
  const [ano, setAno] = useState(data?.ano || '');
  const [sinopse, setSinopse] = useState(data?.sinopse || '');
  const [duracao, setDuracao] = useState(data?.filme?.duracao || '');
  const [urlVideo, setUrlVideo] = useState(data?.filme?.url_filme || '');
  const [imgCapa, setImgCapa] = useState(null);
  const [imgCapaUrl, setImgCapaUrl] = useState(data?.img_capa ? getImageUrl(data.img_capa) : null);
  const [imgCapaPreview, setImgCapaPreview] = useState(data?.img_capa ? getImageUrl(data.img_capa) : null);
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const videoFileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgCapa(file);
      setImgCapaUrl(null);
      setUploadErrorMsg('');
      setImgCapaPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imgCapa) {
      setUploadErrorMsg('Selecione uma imagem antes de enviar.');
      return;
    }

    try {
      setUploadingCapa(true);
      setUploadErrorMsg('');
      const result = await upload(imgCapa);
      setImgCapaUrl(result.url);
      setImgCapaPreview(result.url);
    } catch (err) {
      setUploadErrorMsg(err.message || 'Falha ao enviar a imagem');
    } finally {
      setUploadingCapa(false);
    }
  };

  const handleVideoFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setUploadErrorMsg('');
      const result = await upload(file);
      setUrlVideo(result.url);
    } catch (err) {
      setUploadErrorMsg(err.message || 'Falha ao enviar o vídeo');
    } finally {
      setUploadingVideo(false);
    }
  };

  const triggerVideoFileSelect = () => {
    videoFileInputRef.current?.click();
  };

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

    if (imgCapaUrl) {
      formData.append("img_capa", imgCapaUrl);
    } else if (imgCapa) {
      formData.append("img_capa", imgCapa);
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold">{mode === 'create' ? `Adicionar ${type === 'filme' ? 'Filme' : 'Série'}` : `Editar ${type === 'filme' ? 'Filme' : 'Série'} - ${data?.titulo}`}</h2>
          <button onClick={() => setModal({ isOpen: false })} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
          {/* Lado esquerdo: Selecionador de Imagem */}
          <div className="w-full md:w-1/3 flex flex-col gap-2 shrink-0">
            <label className="text-sm font-bold text-gray-400">Capa do Conteúdo</label>
            <div className="relative aspect-[2/3] rounded-xl bg-black/50 border-2 border-dashed border-purple-400/50 hover:border-purple-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-colors">
              {imgCapaPreview ? (
                <img src={imgCapaPreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center text-gray-500 group-hover:text-purple-400">
                  <IoAddCircleOutline className="text-5xl mb-2" />
                  <span className="text-sm font-bold">Escolher Imagem</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={handleImageUpload} disabled={!imgCapa || uploadingCapa} className="w-full sm:w-auto max-w-[180px] py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors disabled:opacity-50">
                {uploadingCapa ? 'Enviando...' : 'Upload imagem'}
              </button>
              {uploadErrorMsg && <p className="text-xs text-red-400">{uploadErrorMsg}</p>}
              {imgCapaUrl && !uploadingCapa && <p className="text-xs text-green-400">Imagem enviada: Cloudinary pronta para salvar</p>}
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
                  <input ref={videoFileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileSelect} />
                  {uploadErrorMsg && <p className="text-xs text-red-400">{uploadErrorMsg}</p>}
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

// ------------------- MODAL EPISODIO -------------------
function ModalEpisodio({ modal, setModal, dispatch, upload }) {
  const { mode, data, serieId } = modal;

  const [numeroTemporada, setNumeroTemporada] = useState(modal.tempNumero || 1);
  const [numero, setNumero] = useState(data?.numero || '');
  const [titulo, setTitulo] = useState(data?.titulo || '');
  const [descricao, setDescricao] = useState(data?.descricao || '');
  const [urlVideo, setUrlVideo] = useState(data?.url_ep || '');
  const [imgEp, setImgEp] = useState(null);
  const [imgEpUrl, setImgEpUrl] = useState(data?.img_ep ? getImageUrl(data.img_ep) : null);
  const [imgEpPreview, setImgEpPreview] = useState(data?.img_ep ? getImageUrl(data.img_ep) : null);
  const [uploadingEpImage, setUploadingEpImage] = useState(false);
  const [uploadingEpVideo, setUploadingEpVideo] = useState(false);
  const [uploadEpErrorMsg, setUploadEpErrorMsg] = useState('');
  const episodeVideoFileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgEp(file);
      setImgEpUrl(null);
      setUploadEpErrorMsg('');
      setImgEpPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imgEp) {
      setUploadEpErrorMsg('Selecione uma imagem antes de enviar.');
      return;
    }

    try {
      setUploadingEpImage(true);
      setUploadEpErrorMsg('');
      const result = await upload(imgEp);
      setImgEpUrl(result.url);
      setImgEpPreview(result.url);
    } catch (err) {
      setUploadEpErrorMsg(err.message || 'Falha ao enviar a imagem');
    } finally {
      setUploadingEpImage(false);
    }
  };

  const handleVideoFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingEpVideo(true);
      setUploadEpErrorMsg('');
      const result = await upload(file);
      setUrlVideo(result.url);
    } catch (err) {
      setUploadEpErrorMsg(err.message || 'Falha ao enviar o vídeo');
    } finally {
      setUploadingEpVideo(false);
    }
  };

  const triggerEpisodeVideoSelect = () => {
    episodeVideoFileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("numeroTemporada", numeroTemporada);
    formData.append("numero", numero);
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("url_video", urlVideo);

    if (imgEpUrl) {
      formData.append("img_ep", imgEpUrl);
    } else if (imgEp) {
      formData.append("img_ep", imgEp);
    }

    const action = mode === 'create'
      ? adicionarEpisodio({ serieId, numeroTemporada, dadosEpisodio: formData })
      : atualizarEpisodio({ serieId, episodioId: data._id, formData });

    dispatch(action).unwrap()
      .then(() => {
        dispatch(listarConteudos());
        setModal({ isOpen: false });
      })
      .catch(err => alert("Erro: " + err));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold">{mode === 'create' ? 'Adicionar Episódio' : `Editar Episódio - ${data?.titulo}`}</h2>
          <button onClick={() => setModal({ isOpen: false })} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
          {/* Lado esquerdo: Selecionador de Imagem */}
          <div className="w-full md:w-1/3 flex flex-col gap-2 shrink-0">
            <label className="text-sm font-bold text-gray-400">Thumbnail</label>
            <div className="relative aspect-video rounded-xl bg-black/50 border-2 border-dashed border-purple-400/50 hover:border-purple-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-colors">
              {imgEpPreview ? (
                <img src={imgEpPreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center text-gray-500 group-hover:text-purple-400">
                  <IoAddCircleOutline className="text-4xl mb-2" />
                  <span className="text-sm font-bold">Escolher Imagem</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <button type="button" onClick={handleImageUpload} disabled={!imgEp || uploadingEpImage} className="w-full sm:w-auto max-w-[180px] py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors disabled:opacity-50">
              {uploadingEpImage ? 'Enviando...' : 'Upload imagem'}
            </button>
            {uploadEpErrorMsg && <p className="text-xs text-red-400">{uploadEpErrorMsg}</p>}
            {imgEpUrl && !uploadingEpImage && <p className="text-xs text-green-400">Imagem enviada: Cloudinary pronta para salvar</p>}
          </div>

          {/* Lado direito: Campos */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-sm font-bold text-gray-400 mb-1">Nº Temporada</label>
                <input type="number" value={numeroTemporada} onChange={(e) => setNumeroTemporada(e.target.value)} required disabled={mode === 'edit'} className="p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm font-bold text-gray-400 mb-1">Nº Episódio</label>
                <input type="number" value={numero} onChange={(e) => setNumero(e.target.value)} required className="p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-400 mb-1">Título</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required className="w-full p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 mb-1">URL do Vídeo</label>
              <div className="flex gap-2 items-end">
                <input type="text" value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} required className="flex-1 p-2 rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500" />
                <button type="button" onClick={triggerEpisodeVideoSelect} disabled={uploadingEpVideo} className="shrink-0 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors disabled:opacity-50">
                  {uploadingEpVideo ? 'Enviando...' : 'Subir arquivo'}
                </button>
              </div>
              <input ref={episodeVideoFileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileSelect} />
              {uploadEpErrorMsg && <p className="text-xs text-red-400">{uploadEpErrorMsg}</p>}
              {urlVideo && urlVideo.startsWith('http') && <p className="text-xs text-green-400">URL pronta para salvar</p>}
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-sm font-bold text-gray-400 mb-1">Descrição</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-3 flex-1 min-h-[100px] rounded-lg bg-black/50 border border-purple-400/50 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            </div>

            <div className="pt-2 flex justify-end gap-3 mt-auto">
              <Button type="button" onClick={() => setModal({ isOpen: false })} className="bg-transparent border border-white/20 hover:bg-white/5 py-2 px-6 rounded-xl">Cancelar</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-500 py-2 px-6 rounded-xl font-bold shadow-lg shadow-purple-500/20">{mode === 'create' ? 'Criar' : 'Salvar Alterações'}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
