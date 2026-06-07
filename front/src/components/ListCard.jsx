import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from "../utils/getImageUrl";

function gridColSize() {
  const [columns, setColumns] = useState(1);
  const updateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1280) setColumns(5);
    else if (width >= 1024) setColumns(4);
    else if (width >= 500) setColumns(3);
    else setColumns(1);
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columns;
}

function ListCard({ items = [], linkTo = '/filme' }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const cols = gridColSize();

  // When expanded, remove incomplete last row
  const remainder = items.length % cols;
  const completeRowItems = remainder > 0 ? items.slice(0, items.length - remainder) : items;

  // Show only 1 row when collapsed, complete rows when expanded
  const visibleItems = isExpanded ? completeRowItems : items.slice(0, cols);
  
  // Decide whether the "Mostrar mais" (expand) button can be shown
  const canExpand = completeRowItems.length > cols;
  const showExpandButton = !isExpanded && canExpand;

  return (
    <section className='relative w-full'>
      <div
        className={`
          grid gap-3 transition-all duration-700 ease-in-out
          grid-cols-1 min-[500px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
        `}
      >
        {visibleItems.map((item, index) => (
          <div
            key={item._id || index}
            className='flex flex-col cursor-pointer group'
            onClick={() => navigate(`/info/${item._id}`)}
          >
            {/* Image container — 2:3 portrait ratio */}
            <div className='relative bg-zinc-900 rounded-lg overflow-hidden border border-white/5 group-hover:border-purple-600/50 transition-colors duration-300'
              style={{ aspectRatio: '2 / 3' }}
            >
              <img
                src={getImageUrl(item.img_capa)}
                alt={item.titulo || `Catálogo ${index}`}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
              />
              {/* Blur + darken overlay on hover */}
              <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none backdrop-blur-[2px]' />
            </div>
            {/* Title below the image */}
            <p className='mt-2 font-bold text-sm text-gray-100 px-1 leading-snug group-hover:text-purple-300 transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2'>
              {item.titulo}
            </p>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className='flex justify-center mt-6 z-30'>
          {showExpandButton ? (
            <button
              onClick={() => setIsExpanded(true)}
              className='font-bold text-white py-2.5 px-8 bg-purple-600 rounded-lg hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer'
            >
              Mostrar mais
            </button>
          ) : (
            <button
              onClick={() => navigate(linkTo)}
              className='font-bold text-purple-400 border-2 border-purple-600/80 py-2 px-8 bg-transparent rounded-lg hover:bg-purple-600/15 hover:border-purple-500 hover:text-purple-300 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.1)] cursor-pointer'
            >
              Ver mais
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default ListCard;