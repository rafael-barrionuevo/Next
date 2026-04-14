import { useState, useEffect } from 'react';

function gridColSize() {
  const [columns, setColumns] = useState(2);
  const updateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1280) setColumns(5);
    else if (width >= 1024) setColumns(4);
    else if (width >= 500) setColumns(3);
    else setColumns(2);
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columns;
}

function ListCard({ imgLink = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cols = gridColSize();

  const maxCardLength = imgLink.length - (imgLink.length % cols);
  const visibleImages = imgLink.slice(0, maxCardLength);

  return (
    <section className='relative w-full'>
      <div
        className={`
          grid gap-3 transition-all duration-700 ease-in-out overflow-hidden
          grid-cols-2 min-[500px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
          ${!isExpanded ? 'max-h-[50vh]' : 'max-h-500'} 
        `}
      >
        {visibleImages.map((image, index) => (
          <div 
            key={index} 
            className='aspect-video bg-[#1a1a1c] rounded-lg overflow-hidden group border border-white/5 hover:border-purple-600/50 transition-colors duration-300'
          >
            <img
              src={image}
              alt={`Catálogo ${index}`}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
            />
          </div>
        ))}
      </div>

      {!isExpanded && (
        <div className='absolute bottom-0 w-full h-40 bg-linear-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent flex items-end justify-center pb-4'>
          <button
            onClick={() => setIsExpanded(true)}
            className='font-bold text-white py-2.5 px-8 bg-purple-600 rounded-lg hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer'
          >
            Ver mais novidades
          </button>
        </div>
      )}
    </section>
  );
}

export default ListCard;