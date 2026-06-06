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
  const hasMore = items.length > cols;

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
            className='aspect-video relative bg-zinc-900 rounded-lg overflow-hidden group border border-white/5 hover:border-purple-600/50 transition-colors duration-300 cursor-pointer'
            onClick={() => navigate(`/info/${item._id}`)}
          >
            <img
              src={getImageUrl(item.img_capa)}
              alt={item.titulo || `Catálogo ${index}`}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
            />
            {/* Gradient overlay for better text contrast */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none' />
            {/* Title with z-index and subtle hover lift micro-animation */}
            <p className='absolute bottom-0 left-0 w-full font-bold text-md p-4 text-gray-100 z-20 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'>
              {item.titulo}
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className='flex justify-center mt-4 z-30'>
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className='font-bold text-white py-2.5 px-8 bg-purple-600 rounded-lg hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer'
            >
              Ver mais novidades
            </button>
          ) : (
            <button
              onClick={() => navigate(linkTo)}
              className='font-bold text-white py-2.5 px-8 bg-purple-600 rounded-lg hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer'
            >
              Ver todos →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default ListCard;