import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/getImageUrl';

function HeroBannerSkeleton() {
  return (
    <div className='relative w-full h-[50vh] min-h-[320px] max-h-[520px] bg-zinc-900 overflow-hidden'>
      {/* Shimmer animation */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]' />

      {/* Fake content blocks */}
      <div className='absolute bottom-8 left-0 right-0 z-20 mx-auto max-w-7xl px-6 space-y-3'>
        <div className='h-5 w-32 bg-white/10 rounded-full' />
        <div className='h-10 w-80 max-w-full bg-white/10 rounded-lg' />
        <div className='h-4 w-64 max-w-full bg-white/8 rounded-md' />
        <div className='h-10 w-40 bg-purple-600/30 rounded-lg mt-2' />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

function HeroBanner({ item, label = 'Série em destaque', loading = false }) {
  const navigate = useNavigate();

  if (loading) return <HeroBannerSkeleton />;

  if (!item) {
    return (
      <div className='relative w-full h-[50vh] min-h-[320px] max-h-[520px] bg-zinc-900 flex items-center justify-center'>
        <p className='text-gray-500 font-medium text-lg'>Nenhum conteúdo em destaque</p>
      </div>
    );
  }

  return (
    <div
      className='relative w-full h-[50vh] min-h-[320px] max-h-[520px] overflow-hidden cursor-pointer group'
      onClick={() => navigate(`/info/${item._id}`)}
    >
      <img
        src={getImageUrl(item.img_capa)}
        alt={item.titulo}
        className='absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700'
      />
      {/* Dark gradient overlays */}
      <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10' />
      <div className='absolute inset-0 bg-gradient-to-r from-slate-900/70 via-transparent to-transparent z-10' />

      {/* Hero content */}
      <div className='absolute bottom-8 left-0 right-0 z-20 mx-auto max-w-7xl px-6'>
        <span className='inline-block mb-2 px-3 py-1 rounded-full bg-purple-600/80 text-xs font-semibold text-white tracking-wider uppercase backdrop-blur-sm'>
          {label}
        </span>
        <h1 className='text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] leading-tight max-w-2xl'>
          {item.titulo}
        </h1>
        {item.sinopse && (
          <p className='mt-3 text-sm md:text-base text-gray-300 max-w-xl line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]'>
            {item.sinopse}
          </p>
        )}
        <button
          className='mt-4 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg hover:scale-105 transition-all duration-300 shadow-[0_0_24px_rgba(147,51,234,0.4)]'
          onClick={(e) => { e.stopPropagation(); navigate(`/info/${item._id}`) }}
        >
          Ver detalhes →
        </button>
      </div>
    </div>
  );
}

export default HeroBanner;
