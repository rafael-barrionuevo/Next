import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listarConteudos } from '../store/contentSlice';
import api from '../services/api';
import NavBar from '../components/NavBar';
import { IoAddCircleOutline, IoTrashOutline, IoChevronDownOutline, IoChevronUpOutline, IoPencilOutline } from "react-icons/io5";
import { getImageUrl } from "../utils/getImageUrl";
import Button from "../components/button";
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import ModalConteudo from '../components/admin/ModalConteudo';
import ModalEpisodio from '../components/admin/ModalEpisodio';

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
    <div className="min-h-screen bg-slate-900 text-white">
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
              <div key={filme._id} className="relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 border border-white/5 hover:border-purple-500/50 transition-all">
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
              className="aspect-[2/3] rounded-xl bg-slate-800 border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
            >
              <IoAddCircleOutline className="text-4xl text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="text-gray-500 group-hover:text-purple-400 font-bold transition-colors">Adicionar Filme</span>
            </div>
          </div>
        )}

        {/* SÉRIES */}
        {activeTab === 'series' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setModalConteudo({ isOpen: true, mode: 'create', data: null, type: 'serie' })} className="bg-purple-600 hover:bg-purple-500 py-2 px-4 rounded-lg font-bold flex items-center gap-2">
                <IoAddCircleOutline className="text-xl" /> Adicionar Série
              </Button>
            </div>

            {series.map(serie => (
              <div key={serie._id} className="bg-slate-800 border border-white/5 rounded-xl overflow-hidden transition-all">
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
                                <div key={ep._id} className="min-w-[240px] max-w-[240px] bg-zinc-900 border border-white/10 rounded-xl overflow-hidden group">
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
