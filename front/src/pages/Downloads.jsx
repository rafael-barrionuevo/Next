import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineFileDownload, MdDeleteOutline, MdDelete } from 'react-icons/md';
import { BsFilm, BsCameraVideo } from 'react-icons/bs';
import NavBar from '../components/NavBar.jsx';
import FooNavBar from '../components/FooNavBar.jsx';
import { getImageUrl } from '../utils/getImageUrl';

function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
    setDownloads(saved);
  }, []);

  const removeDownload = (downloadId) => {
    const updated = downloads.filter(d => d.downloadId !== downloadId);
    localStorage.setItem('next_downloads', JSON.stringify(updated));
    setDownloads(updated);
  };

  const clearAll = () => {
    localStorage.removeItem('next_downloads');
    setDownloads([]);
    setShowConfirmClear(false);
  };

  const totalSize = downloads.length * 1.2; // Simulação de tamanho em GB

  return (
    <div className='flex flex-col min-h-screen bg-[#0d1117] pb-24'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none' />
      <NavBar />

      <div className='flex-1 relative z-10 px-4 max-w-3xl mx-auto w-full mt-6'>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-purple-600/20 p-2.5 rounded-xl'>
              <MdOutlineFileDownload className='text-purple-400 text-2xl' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-white'>Downloads</h1>
              {downloads.length > 0 && (
                <p className='text-xs text-gray-500'>
                  {downloads.length} {downloads.length === 1 ? 'item' : 'itens'} · ~{totalSize.toFixed(1)} GB usados
                </p>
              )}
            </div>
          </div>

          {downloads.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className='flex items-center gap-1.5 text-red-500 hover:text-red-400 text-sm font-medium transition-colors'
            >
              <MdDelete className='text-lg' />
              Limpar tudo
            </button>
          )}
        </div>

        {/* Modal de confirmação */}
        {showConfirmClear && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6'>
            <div className='bg-[#1a1a1c] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl'>
              <h2 className='text-white font-bold text-lg mb-2'>Remover todos os downloads?</h2>
              <p className='text-gray-400 text-sm mb-6'>Todos os {downloads.length} itens serão removidos. Esta ação não pode ser desfeita.</p>
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className='flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium'
                >
                  Cancelar
                </button>
                <button
                  onClick={clearAll}
                  className='flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors text-sm font-bold'
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {downloads.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='relative mb-6'>
              <div className='w-24 h-24 rounded-full bg-purple-600/10 flex items-center justify-center'>
                <MdOutlineFileDownload className='text-purple-500/40 text-5xl' />
              </div>
              <div className='absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1a1a1c] border border-white/10 flex items-center justify-center'>
                <span className='text-gray-500 text-lg font-bold'>0</span>
              </div>
            </div>
            <h2 className='text-white text-xl font-semibold mb-2'>Nenhum download ainda</h2>
            <p className='text-gray-500 text-sm max-w-xs leading-relaxed mb-8'>
              Baixe filmes e episódios para assistir offline, quando e onde quiser.
            </p>
            <button
              onClick={() => navigate('/home')}
              className='bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
            >
              Explorar conteúdos
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {downloads.map(item => (
              <div
                key={item.downloadId}
                className='flex items-center gap-4 bg-[#1a1a1c] border border-white/5 rounded-2xl p-4 hover:border-purple-600/30 transition-all duration-300 group'
              >
                {/* Capa */}
                <div
                  className='relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer'
                  onClick={() => navigate(`/info/${item.contentId}`)}
                >
                  <img
                    src={item.img_capa ? getImageUrl(item.img_capa) : 'https://via.placeholder.com/80x112'}
                    alt={item.titulo}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <h3
                    className='text-white font-semibold text-base line-clamp-1 cursor-pointer hover:text-purple-400 transition-colors'
                    onClick={() => navigate(`/info/${item.contentId}`)}
                  >
                    {item.titulo}
                  </h3>

                  {/* Badge tipo */}
                  <div className='flex items-center gap-1.5 mt-1 mb-2'>
                    {item.tipo === 'serie' ? (
                      <BsCameraVideo className='text-purple-400 text-xs' />
                    ) : (
                      <BsFilm className='text-purple-400 text-xs' />
                    )}
                    <span className='text-xs text-purple-400 font-medium'>
                      {item.tipo === 'serie'
                        ? `T${item.temporada} • Ep. ${item.episodio} – ${item.tituloEpisodio}`
                        : 'Filme'
                      }
                    </span>
                  </div>

                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-gray-500'>~1.2 GB</span>
                    <span className='text-gray-700 text-xs'>·</span>
                    <span className='text-xs text-green-500 font-medium'>✓ Disponível offline</span>
                  </div>
                </div>

                {/* Botão remover */}
                <button
                  onClick={() => removeDownload(item.downloadId)}
                  className='p-2 text-gray-600 hover:text-red-500 transition-colors flex-shrink-0 rounded-lg hover:bg-red-500/10'
                  title='Remover download'
                >
                  <MdDeleteOutline className='text-xl' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <FooNavBar />
    </div>
  );
}

export default Downloads;
