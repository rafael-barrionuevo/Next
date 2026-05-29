import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listarConteudos } from '../store/contentSlice';
import { Rating } from 'react-simple-star-rating';
import { getImageUrl } from '../utils/getImageUrl';
import { useAvaliacoes } from '../hooks/useAvaliacoes';
import { useDownload } from '../hooks/useDownload';
import NavBar from '../components/NavBar.jsx';
import FooNavBar from '../components/FooNavBar.jsx';
import WishlistButton from '../components/WishlistButton.jsx';
import DownloadButton from '../components/DownloadButton.jsx';
import EpisodeList from '../components/EpisodeList.jsx';
import AvaliacaoSection from '../components/AvaliacaoSection.jsx';

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
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  // Hooks extraídos
  const avaliacaoState = useAvaliacoes(id, currentUserId, perfilAtivo, isAuthenticated);
  const { downloadingIds, downloadedIds, downloadProgress, handleDownloadFilme, handleDownloadEpisodio } = useDownload();

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

  const handleSeasonChange = (e) => {
    const seasonNumber = Number(e.target.value);
    setSelectedSeason(seasonNumber);
    const season = content.temporadas.find(t => t.numero === seasonNumber);
    setEpisodes(season ? season.episodios : []);
  };

  if (!content) {
    return (
      <div className='flex flex-col min-h-screen bg-slate-900'>
        <NavBar />
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-white'>Carregando...</p>
        </div>
        <FooNavBar />
      </div>
    );
  }

  const naLista = listaDesejos.some(item => (item._id || item) === content._id);
  const filmeDownloadId = `filme_${content._id}`;

  return (
    <div className='flex flex-col min-h-screen bg-slate-900 pb-20'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none'></div>
      <NavBar />

      <div className='flex-1 relative z-10 px-4 max-w-7xl mx-auto w-full mt-8'>
        <div className='flex flex-col md:flex-row gap-8 bg-zinc-900 p-6 rounded-2xl border border-white/5'>
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

            {/* Avaliação geral */}
            <div className='mb-6 flex items-center gap-4'>
              <div className="flex flex-row items-center [&_svg]:inline-block">
                <Rating
                  key={avaliacaoState.rating}
                  initialValue={avaliacaoState.rating / 2}
                  readonly={true}
                  allowFraction={true}
                  size={28}
                  fillColor="#9333ea"
                  emptyColor="#374151"
                />
              </div>
              <span className='text-white/80 font-medium'>{avaliacaoState.rating > 0 ? `${(avaliacaoState.rating / 2).toFixed(1)}/5.0` : 'Sem avaliações'}</span>
            </div>

            <p className='text-gray-300 text-lg mb-8 leading-relaxed'>
              {content.sinopse || 'Nenhuma sinopse disponível para este conteúdo.'}
            </p>

            {content.tipo_midia === 'filme' ? (
              <div className='mt-auto flex flex-wrap gap-3 items-center'>
                <button
                  onClick={() => navigate(`/video/${content._id}`)}
                  className='bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer'
                >
                  Assistir Filme
                </button>
                <WishlistButton contentId={content._id} isInList={naLista} />
                <DownloadButton
                  downloadId={filmeDownloadId}
                  isDownloading={downloadingIds.has(filmeDownloadId)}
                  isDownloaded={downloadedIds.has(filmeDownloadId)}
                  progress={downloadProgress[filmeDownloadId] || 0}
                  onDownload={() => handleDownloadFilme(content)}
                  variant='full'
                />
              </div>
            ) : (
              <div className='mt-auto flex flex-wrap gap-3 items-center'>
                <button
                  onClick={() => document.getElementById('temporadas-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className='bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer'
                >
                  Assistir Série
                </button>
                <WishlistButton contentId={content._id} isInList={naLista} />
              </div>
            )}
          </div>
        </div>

        {content.tipo_midia === 'serie' && (
          <div id='temporadas-section' className='mt-12'>
            <EpisodeList
              content={content}
              selectedSeason={selectedSeason}
              episodes={episodes}
              onSeasonChange={handleSeasonChange}
              onPlayEpisode={(epId) => navigate(`/video/${epId}`)}
              downloadingIds={downloadingIds}
              downloadedIds={downloadedIds}
              downloadProgress={downloadProgress}
              onDownloadEpisode={(ep) => handleDownloadEpisodio(content, ep, selectedSeason)}
            />
          </div>
        )}
      </div>

      <AvaliacaoSection
        isAuthenticated={isAuthenticated}
        currentUserId={currentUserId}
        {...avaliacaoState}
      />

      <FooNavBar />
    </div>
  );
}

export default ContentInfo;
