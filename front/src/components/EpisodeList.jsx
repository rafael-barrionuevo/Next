import { getImageUrl } from '../utils/getImageUrl';
import DownloadButton from './DownloadButton';

/**
 * Seção de episódios: seletor de temporada + grid de cards.
 */
export default function EpisodeList({
  content, selectedSeason, episodes,
  onSeasonChange, onPlayEpisode,
  downloadingIds, downloadedIds, downloadProgress,
  onDownloadEpisode,
}) {
  return (
    <div className='mt-12'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-white border-l-4 border-purple-600 pl-3'>Episódios</h2>
        <select
          className='bg-zinc-900 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 cursor-pointer'
          value={selectedSeason || ''}
          onChange={onSeasonChange}
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
          episodes.map(ep => {
            const downloadId = `ep_${ep._id}`;
            return (
              <div key={ep._id} className='bg-zinc-900 border border-white/5 rounded-xl overflow-hidden group hover:border-purple-600/50 transition-all duration-300 flex flex-col'>
                <div className='relative aspect-video overflow-hidden'>
                  <img
                    src={ep.img_ep ? getImageUrl(ep.img_ep) : 'https://via.placeholder.com/320x180'}
                    alt={ep.titulo}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <button
                      onClick={() => onPlayEpisode(ep._id)}
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
                  <DownloadButton
                    downloadId={downloadId}
                    isDownloading={downloadingIds.has(downloadId)}
                    isDownloaded={downloadedIds.has(downloadId)}
                    progress={downloadProgress[downloadId] || 0}
                    onDownload={() => onDownloadEpisode(ep)}
                    variant='icon'
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
