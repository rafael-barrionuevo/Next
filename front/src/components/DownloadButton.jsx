import { MdOutlineFileDownload, MdDownloadDone, MdDownloading } from 'react-icons/md';

/**
 * Botão de download com estado visual (idle, downloading, done) e barra de progresso.
 * @param {{ downloadId: string, isDownloading: boolean, isDownloaded: boolean, progress: number, onDownload: Function, variant?: 'full'|'icon' }} props
 */
export default function DownloadButton({ downloadId, isDownloading, isDownloaded, progress = 0, onDownload, variant = 'full' }) {
  if (variant === 'icon') {
    return (
      <div className='flex flex-col items-end gap-1 flex-shrink-0 md:hidden'>
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
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
  }

  // variant === 'full'
  return (
    <div className='flex flex-col gap-1 md:hidden'>
      <button
        onClick={onDownload}
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
}
