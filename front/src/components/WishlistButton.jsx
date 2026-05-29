import { useDispatch } from 'react-redux';
import { adicionarWishlist, removerWishlist } from '../store/userSlice';

/**
 * Botão circular de adicionar/remover da lista de desejos com tooltip.
 * @param {{ contentId: string, isInList: boolean, className?: string }} props
 */
export default function WishlistButton({ contentId, isInList, className = '' }) {
  const dispatch = useDispatch();

  return (
    <div className={`relative group/wishlist ${className}`}>
      <button
        onClick={() => isInList
          ? dispatch(removerWishlist(contentId))
          : dispatch(adicionarWishlist(contentId))
        }
        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${isInList
          ? 'border-purple-500 bg-purple-600/20 text-purple-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400'
          : 'border-white/40 bg-white/5 text-white hover:border-white hover:bg-white/15'
        }`}
      >
        {isInList ? (
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
        {isInList ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
      </span>
    </div>
  );
}
