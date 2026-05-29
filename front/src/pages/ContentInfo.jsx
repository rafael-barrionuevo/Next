import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listarConteudos } from '../store/contentSlice';
import NavBar from '../components/NavBar.jsx';
import FooNavBar from '../components/FooNavBar.jsx';
import api from '../services/api';
import { Rating } from 'react-simple-star-rating';
import { getImageUrl } from '../utils/getImageUrl';
import { MdOutlineFileDownload, MdDownloadDone, MdDownloading } from 'react-icons/md';
import { adicionarWishlist, removerWishlist } from '../store/userSlice';

// Gera uma cor de fundo baseada no nome
function getAvatarColor(name = '') {
  const colors = ['#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706', '#dc2626', '#4f46e5'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// Formata data para pt-BR
function formatarData(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function ContentInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const contents = useSelector(state => state.content.items);
  const status = useSelector(state => state.content.status);
  const listaDesejos = useSelector(state => state.user.lista_desejos || []);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const currentUserId = useSelector(state => state.user.id);
  const perfilAtivo = useSelector(state => state.user.perfilAtivo);

  const [content, setContent] = useState(null);
  const [rating, setRating] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [downloadedIds, setDownloadedIds] = useState(new Set());
  const [downloadProgress, setDownloadProgress] = useState({});

  // Estados de avaliações / comentários
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null); // avaliação do perfil ativo
  const [formNota, setFormNota] = useState(5);
  const [formComentario, setFormComentario] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [editingId, setEditingId] = useState(null); // _id da avaliação em modo edição

  useEffect(() => {
    if (contents.length === 0 && status === 'idle') {
      dispatch(listarConteudos());
    } else {
      const foundContent = contents.find(c => c._id === id);
      if (foundContent) {
        setContent(foundContent);
        if (foundContent.tipo_midia === 'serie' && foundContent.temporadas?.length > 0) {
          const sortedSeasons = [...foundContent.temporadas].sort((a, b) => a.numero - b.numero);
          setSelectedSeason(sortedSeasons[0].numero);
          setEpisodes(sortedSeasons[0].episodios || []);
        }
      }
    }
  }, [id, contents, status, dispatch]);

  const fetchAvaliacoes = useCallback(async () => {
    try {
      const response = await api.get(`/conteudos/${id}/avaliacoes`);
      const data = response.data;

      // Calcula média para o rating geral
      if (data.length > 0) {
        const total = data.reduce((acc, curr) => acc + curr.nota, 0);
        let average = total / data.length;
        const dec = average % 1;
        average = dec === 0.5 ? Math.floor(average) + 0.5 : Math.round(average);
        setRating(average);
      } else {
        setRating(0);
      }

      // Detecta avaliação do PERFIL ativo (match por perfilId quando há perfil, ou por usuarioId sem perfil)
      let minha = null;
      if (currentUserId) {
        const perfilId = perfilAtivo?._id?.toString() || null;
        if (perfilId) {
          minha = data.find(a => a.perfilId === perfilId && (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId));
        } else {
          minha = data.find(a =>
            (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId) && !a.perfilId
          );
        }
      }
      setMinhaAvaliacao(minha || null);
      if (minha) {
        setFormNota(minha.nota);
        setFormComentario(minha.comentario || '');
      } else {
        setFormNota(5);
        setFormComentario('');
      }

      // Ordena: perfil ativo primeiro, depois outros perfis do mesmo usuário, depois o resto (todos por nota desc)
      const sorted = [...data].sort((a, b) => {
        const perfilId = perfilAtivo?._id?.toString() || null;
        const aIsMe = perfilId
          ? a.perfilId === perfilId
          : (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId) && !a.perfilId;
        const bIsMe = perfilId
          ? b.perfilId === perfilId
          : (b.usuarioId === currentUserId || b.usuarioId?._id === currentUserId) && !b.perfilId;
        const aIsSameUser = !aIsMe && (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId);
        const bIsSameUser = !bIsMe && (b.usuarioId === currentUserId || b.usuarioId?._id === currentUserId);

        if (aIsMe && !bIsMe) return -1;
        if (!aIsMe && bIsMe) return 1;
        if (aIsSameUser && !bIsSameUser) return -1;
        if (!aIsSameUser && bIsSameUser) return 1;
        return b.nota - a.nota; // restante: maior nota primeiro
      });
      setAvaliacoes(sorted);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  }, [id, currentUserId, perfilAtivo]);

  useEffect(() => {
    if (id) fetchAvaliacoes();
  }, [id, fetchAvaliacoes]);

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const targetId = editingId || minhaAvaliacao?._id;
      if (targetId) {
        await api.patch(`/avaliacoes/${targetId}`, {
          nota: Number(formNota),
          comentario: formComentario,
        });
        setEditingId(null);
      } else {
        await api.post('/avaliacoes', {
          conteudoId: id,
          nota: Number(formNota),
          comentario: formComentario,
          perfilId: perfilAtivo?._id?.toString() || null,
        });
      }
      setSubmitStatus('success');
      await fetchAvaliacoes();
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError(err.response?.data?.error || 'Erro ao enviar avaliação.');
    }
  };

  const handleSeasonChange = (e) => {
    const seasonNumber = Number(e.target.value);
    setSelectedSeason(seasonNumber);
    const season = content.temporadas.find(t => t.numero === seasonNumber);
    setEpisodes(season ? season.episodios : []);
  };

  const handlePlayMovie = () => {
    navigate(`/video/${content._id}`);
  };

  const handlePlayEpisode = (episodeId) => {
    navigate(`/video/${episodeId}`);
  };

  // Carrega downloads existentes do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
    const ids = new Set(saved.map(d => d.downloadId));
    setDownloadedIds(ids);
  }, []);

  const simulateDownload = useCallback((downloadId, onComplete) => {
    setDownloadingIds(prev => new Set(prev).add(downloadId));
    setDownloadProgress(prev => ({ ...prev, [downloadId]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadingIds(prev => { const s = new Set(prev); s.delete(downloadId); return s; });
        setDownloadedIds(prev => new Set(prev).add(downloadId));
        setDownloadProgress(prev => { const p = { ...prev }; delete p[downloadId]; return p; });
        onComplete();
      }
      setDownloadProgress(prev => ({ ...prev, [downloadId]: Math.min(progress, 100) }));
    }, 200);
  }, []);

  const handleDownloadFilme = () => {
    if (!content) return;
    const downloadId = `filme_${content._id}`;
    if (downloadedIds.has(downloadId) || downloadingIds.has(downloadId)) return;

    simulateDownload(downloadId, () => {
      const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
      const item = {
        downloadId,
        contentId: content._id,
        titulo: content.titulo,
        img_capa: content.img_capa,
        tipo: 'filme',
      };
      localStorage.setItem('next_downloads', JSON.stringify([...saved, item]));
    });
  };

  const handleDownloadEpisodio = (ep) => {
    if (!content) return;
    const downloadId = `ep_${ep._id}`;
    if (downloadedIds.has(downloadId) || downloadingIds.has(downloadId)) return;

    simulateDownload(downloadId, () => {
      const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
      const item = {
        downloadId,
        contentId: content._id,
        titulo: content.titulo,
        img_capa: content.img_capa,
        tipo: 'serie',
        temporada: selectedSeason,
        episodio: ep.numero,
        tituloEpisodio: ep.titulo,
      };
      localStorage.setItem('next_downloads', JSON.stringify([...saved, item]));
    });
  };

  if (!content) {
    return (
      <div className='flex flex-col min-h-screen bg-[#0d1117]'>
        <NavBar />
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-white'>Carregando...</p>
        </div>
        <FooNavBar />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen bg-[#0d1117] relative pb-20'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none'></div>
      <NavBar />

      <div className='flex-1 relative z-10 px-4 max-w-7xl mx-auto w-full mt-8'>
        <div className='flex flex-col md:flex-row gap-8 bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 relative'>
          {/* Botão fechar */}
          <button
            onClick={() => navigate(-1)}
            className='absolute top-4 right-4 text-white hover:text-white/80 rounded-full p-1.5 z-10'
            title='Fechar'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          <div className='w-full md:w-1/3'>
            <img
              src={content.img_capa ? getImageUrl(content.img_capa) : 'https://via.placeholder.com/300x450'}
              alt={content.titulo}
              className='w-full rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.2)]'
            />
          </div>
          <div className='w-full md:w-2/3 flex flex-col'>
            <h1 className='text-4xl font-bold text-white mb-2'>{content.titulo}</h1>
            <div className='flex flex-wrap gap-3 mb-4'>
              <span className='px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-semibold'>
                {content.ano}
              </span>
              <span className='px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm'> Classificação: {content.classificacao || 'Livre'}
              </span>
              {content.genero?.map((g, index) => (
                <span key={index} className='px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm'>
                  {g}
                </span>
              ))}
            </div>

            {/* Avaliação */}
            <div className='mb-6 flex items-center gap-4'>
              <div className="flex flex-row items-center [&_svg]:inline-block">
                <Rating
                  key={rating}
                  initialValue={rating / 2}
                  readonly={true}
                  allowFraction={true}
                  size={28}
                  fillColor="#9333ea"
                  emptyColor="#374151"
                />
              </div>
              <span className='text-white/80 font-medium'>{rating > 0 ? `${(rating / 2).toFixed(1)}/5.0` : 'Sem avaliações'}</span>
            </div>

            <p className='text-gray-300 text-lg mb-8 leading-relaxed'>
              {content.sinopse || 'Nenhuma sinopse disponível para este conteúdo.'}
            </p>

            {content.tipo_midia === 'filme' && (
              <div className='mt-auto flex flex-wrap gap-3 items-center'>
                <button
                  onClick={handlePlayMovie}
                  className='bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer'
                >
                  Assistir Filme
                </button>

                {/* Botão + Minha Lista */}
                {(() => {
                  const naLista = listaDesejos.some(item =>
                    (item._id || item) === content._id
                  );
                  return (
                    <div className='relative group/wishlist'>
                      <button
                        onClick={() => naLista
                          ? dispatch(removerWishlist(content._id))
                          : dispatch(adicionarWishlist(content._id))
                        }
                        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${naLista
                          ? 'border-purple-500 bg-purple-600/20 text-purple-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400'
                          : 'border-white/40 bg-white/5 text-white hover:border-white hover:bg-white/15'
                          }`}
                      >
                        {naLista ? (
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                          </svg>
                        ) : (
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M12 4v16m8-8H4' />
                          </svg>
                        )}
                      </button>
                      {/* Tooltip */}
                      <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/wishlist:opacity-100 transition-opacity duration-200 pointer-events-none'>
                        {naLista ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
                      </span>
                    </div>
                  );
                })()}

                {/* Botão de Download do Filme - apenas mobile */}
                {(() => {
                  const downloadId = `filme_${content._id}`;
                  const isDownloading = downloadingIds.has(downloadId);
                  const isDownloaded = downloadedIds.has(downloadId);
                  const progress = downloadProgress[downloadId] || 0;
                  return (
                    <div className='flex flex-col gap-1 md:hidden'>
                      <button
                        onClick={handleDownloadFilme}
                        disabled={isDownloading || isDownloaded}
                        className={`flex items-center gap-2 font-bold py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer border ${isDownloaded
                          ? 'border-green-600/50 text-green-400 bg-green-600/10 cursor-default'
                          : isDownloading
                            ? 'border-purple-600/50 text-purple-400 bg-purple-600/10 cursor-wait'
                            : 'border-white/10 text-white hover:border-purple-500 hover:bg-purple-600/10 hover:scale-105'
                          }`}
                      >
                        {isDownloaded ? (
                          <><MdDownloadDone className='text-xl' /> Baixado</>
                        ) : isDownloading ? (
                          <><MdDownloading className='text-xl animate-bounce' /> Baixando...</>
                        ) : (
                          <><MdOutlineFileDownload className='text-xl' /> Baixar</>
                        )}
                      </button>
                      {isDownloading && (
                        <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-purple-500 rounded-full transition-all duration-200'
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {content.tipo_midia === 'serie' && (
          <div className='mt-12'>
            {/* Botão + Minha Lista para séries */}
            {(() => {
              const naLista = listaDesejos.some(item =>
                (item._id || item) === content._id
              );
              return (
                <div className='relative group/wishlist inline-block mb-6'>
                  <button
                    onClick={() => naLista
                      ? dispatch(removerWishlist(content._id))
                      : dispatch(adicionarWishlist(content._id))
                    }
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${naLista
                      ? 'border-purple-500 bg-purple-600/20 text-purple-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400'
                      : 'border-white/40 bg-white/5 text-white hover:border-white hover:bg-white/15'
                      }`}
                  >
                    {naLista ? (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M12 4v16m8-8H4' />
                      </svg>
                    )}
                  </button>
                  <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/wishlist:opacity-100 transition-opacity duration-200 pointer-events-none'>
                    {naLista ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
                  </span>
                </div>
              );
            })()}

            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-white border-l-4 border-purple-600 pl-3'>Episódios</h2>
              <select
                className='bg-[#1a1a1c] text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 cursor-pointer'
                value={selectedSeason || ''}
                onChange={handleSeasonChange}
              >
                {content.temporadas?.map(t => (
                  <option key={t.numero} value={t.numero}>Temporada {t.numero}</option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {episodes.length === 0 ? (
                <p className='text-gray-500 col-span-full'>Nenhum episódio cadastrado nesta temporada.</p>
              ) : (
                episodes.map(ep => (
                  <div key={ep._id} className='bg-[#1a1a1c] border border-white/5 rounded-xl overflow-hidden group hover:border-purple-600/50 transition-all duration-300 flex flex-col'>
                    <div className='relative aspect-video overflow-hidden'>
                      <img
                        src={ep.img_ep ? getImageUrl(ep.img_ep) : 'https://via.placeholder.com/320x180'}
                        alt={ep.titulo}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                        <button
                          onClick={() => handlePlayEpisode(ep._id)}
                          className='bg-purple-600 text-white p-3 rounded-full hover:bg-purple-500 transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.5)] cursor-pointer'
                        >
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4l12 6-12 6z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className='p-4 flex items-start justify-between gap-2'>
                      <h3 className='text-white font-semibold line-clamp-1 flex-1'>{ep.numero} - {ep.titulo}</h3>
                      {/* Botão download por episódio - apenas mobile */}
                      {(() => {
                        const downloadId = `ep_${ep._id}`;
                        const isDownloading = downloadingIds.has(downloadId);
                        const isDownloaded = downloadedIds.has(downloadId);
                        const progress = downloadProgress[downloadId] || 0;
                        return (
                          <div className='flex flex-col items-end gap-1 flex-shrink-0 md:hidden'>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDownloadEpisodio(ep); }}
                              disabled={isDownloading || isDownloaded}
                              title={isDownloaded ? 'Já baixado' : 'Baixar episódio'}
                              className={`p-1.5 rounded-lg transition-all duration-300 ${isDownloaded
                                ? 'text-green-400 bg-green-600/10 cursor-default'
                                : isDownloading
                                  ? 'text-purple-400 bg-purple-600/10 cursor-wait'
                                  : 'text-gray-400 hover:text-purple-400 hover:bg-purple-600/10 cursor-pointer'
                                }`}
                            >
                              {isDownloaded ? (
                                <MdDownloadDone className='text-lg' />
                              ) : isDownloading ? (
                                <MdDownloading className='text-lg animate-bounce' />
                              ) : (
                                <MdOutlineFileDownload className='text-lg' />
                              )}
                            </button>
                            {isDownloading && (
                              <div className='w-12 h-0.5 bg-white/10 rounded-full overflow-hidden'>
                                <div
                                  className='h-full bg-purple-500 rounded-full transition-all duration-200'
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Seção de Avaliações / Comentários ─── */}
      <div className='relative z-10 px-4 max-w-7xl mx-auto w-full mt-10 mb-8'>
        <h2 className='text-2xl font-bold text-white border-l-4 border-purple-600 pl-3 mb-8'>
          Avaliações e Comentários
        </h2>

        {/* Formulário: só aparece para usuários logados sem avaliação do perfil ativo */}
        {isAuthenticated && !minhaAvaliacao && (
          <form
            onSubmit={handleSubmitAvaliacao}
            className='bg-[#1a1a1c] border border-white/5 rounded-2xl p-6 mb-10'
          >
            <h3 className='text-lg font-semibold text-white mb-5'>Deixe sua avaliação</h3>

            <div className='mb-5'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Nota <span className='text-purple-400 font-bold text-base ml-1'>{(formNota / 2).toFixed(1)}</span>
                <span className='text-gray-500'>/5.0</span>
              </label>
              <div className='flex items-center gap-4 [&_svg]:inline-block'>
                <Rating
                  onClick={(rate) => setFormNota(rate * 2)}
                  initialValue={formNota / 2}
                  allowFraction={true}
                  size={32}
                  fillColor="#9333ea"
                  emptyColor="#374151"
                />
              </div>
            </div>

            <div className='mb-5'>
              <label htmlFor='comentario-new' className='block text-sm font-medium text-gray-400 mb-2'>
                Comentário <span className='text-gray-600'>(opcional, máx. 500 caracteres)</span>
              </label>
              <textarea
                id='comentario-new'
                value={formComentario}
                onChange={e => setFormComentario(e.target.value)}
                maxLength={500} rows={3}
                placeholder='Conte o que achou deste conteúdo...'
                className='w-full bg-[#0d1117] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-gray-600 resize-none text-sm transition-colors duration-200'
              />
              <p className='text-xs text-gray-600 text-right mt-1'>{formComentario.length}/500</p>
            </div>

            {submitStatus === 'error' && (
              <p className='text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2'>{submitError}</p>
            )}
            {submitStatus === 'success' && (
              <p className='text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2'>Avaliação enviada com sucesso!</p>
            )}

            <button
              type='submit'
              disabled={submitStatus === 'loading'}
              className='bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer text-sm'
            >
              {submitStatus === 'loading' ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <div className='bg-[#1a1a1c] border border-white/5 rounded-2xl p-6 mb-10 text-center'>
            <p className='text-gray-400 text-sm'>
              <button onClick={() => navigate('/login')} className='text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 cursor-pointer'>
                Faça login
              </button>
              {' '}para deixar sua avaliação.
            </p>
          </div>
        )}

        {/* Lista de avaliações */}
        {avaliacoes.length === 0 ? (
          <p className='text-gray-500 text-sm text-center py-8'>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
        ) : (
          <div className='flex flex-col gap-4'>
            {avaliacoes.map(av => {
              const isOwn = currentUserId && (av.usuarioId === currentUserId || av.usuarioId?._id === currentUserId);
              const isEditing = editingId === av._id;

              return (
                <div
                  key={av._id}
                  className='bg-[#1a1a1c] border border-white/5 rounded-2xl p-5 hover:border-purple-600/30 transition-all duration-200'
                >
                  <div className='flex gap-4'>
                    {/* Avatar */}
                    <div
                      className='w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg select-none shadow-lg'
                      style={{ backgroundColor: getAvatarColor(av.nome_perfil || av.nome_usuario) }}
                    >
                      {(av.nome_perfil || av.nome_usuario)?.charAt(0).toUpperCase() || '?'}
                    </div>

                    <div className='flex-1 min-w-0'>
                      {/* Cabeçalho */}
                      <div className='flex flex-wrap items-center gap-2 mb-1'>
                        <span className='text-white font-semibold text-sm'>
                          {av.nome_perfil || av.nome_usuario}
                        </span>
                        {av.nome_perfil && av.nome_perfil !== av.nome_usuario && (
                          <span className='text-gray-500 text-xs'>({av.nome_usuario})</span>
                        )}
                        {av.data && (
                          <span className='text-gray-500 text-xs ml-auto'>{formatarData(av.data)}</span>
                        )}
                      </div>

                      {/* Estrelas 0–5 */}
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='flex items-center [&_svg]:inline-block'>
                          <Rating
                            key={av._id}
                            initialValue={av.nota / 2}
                            readonly={true}
                            allowFraction={true}
                            size={16}
                            fillColor="#9333ea"
                            emptyColor="#374151"
                          />
                        </div>
                        <span className='text-purple-400 text-xs font-bold'>{(av.nota / 2).toFixed(1)}<span className='text-gray-500'>/5</span></span>
                      </div>

                      {/* Comentário */}
                      {!isEditing && (
                        av.comentario
                          ? <p className='text-gray-300 text-sm leading-relaxed'>{av.comentario}</p>
                          : <p className='text-gray-600 text-xs italic'>Sem comentário.</p>
                      )}

                      {/* Botão editar (só para avaliações do próprio usuário) */}
                      {isOwn && !isEditing && (
                        <button
                          onClick={() => {
                            setEditingId(av._id);
                            setFormNota(av.nota);
                            setFormComentario(av.comentario || '');
                            setSubmitStatus('idle');
                          }}
                          className='mt-2 text-xs text-gray-500 hover:text-purple-400 transition-colors duration-200 cursor-pointer'
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Formulário de edição inline */}
                  {isEditing && (
                    <form
                      onSubmit={handleSubmitAvaliacao}
                      className='mt-4 pt-4 border-t border-white/5'
                    >
                      <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-400 mb-2'>
                          Nota <span className='text-purple-400 font-bold ml-1'>{formNota}</span><span className='text-gray-500'>/10</span>
                        </label>
                        <div className='flex items-center gap-4 [&_svg]:inline-block'>
                          <Rating
                            onClick={(rate) => setFormNota(rate * 2)}
                            initialValue={formNota / 2}
                            allowFraction={true}
                            size={28}
                            fillColor="#9333ea"
                            emptyColor="#374151"
                          />
                        </div>
                      </div>

                      <textarea
                        value={formComentario}
                        onChange={e => setFormComentario(e.target.value)}
                        maxLength={500} rows={3}
                        placeholder='Seu comentário...'
                        className='w-full bg-[#0d1117] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-gray-600 resize-none text-sm mb-3'
                      />

                      {submitStatus === 'error' && (
                        <p className='text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2'>{submitError}</p>
                      )}
                      {submitStatus === 'success' && (
                        <p className='text-green-400 text-sm mb-3 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2'>Avaliação atualizada!</p>
                      )}

                      <div className='flex gap-3'>
                        <button
                          type='submit'
                          disabled={submitStatus === 'loading'}
                          className='bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 cursor-pointer text-sm'
                        >
                          {submitStatus === 'loading' ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                          type='button'
                          onClick={() => { setEditingId(null); setSubmitStatus('idle'); }}
                          className='text-gray-400 hover:text-white py-2 px-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer text-sm'
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FooNavBar />
    </div>
  );
}

export default ContentInfo;
