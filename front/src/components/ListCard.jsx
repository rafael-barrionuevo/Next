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

  // Atualiza as colunas do grid quando cria o componente ou redimensiona a janela
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

  // para evitar espaços vazios, algumas imagens sao escondidas 
  const maxCardLength = imgLink.length - (imgLink.length % cols);
  const visibleImages = imgLink.slice(0, maxCardLength);

  return (
    <section className='relative w-full'>
      <div
        className={`
          grid gap-2 transition-all duration-700 ease-in-out overflow-hidden
          grid-cols-2 min-[500px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
          ${!isExpanded ? 'max-h-[50vh]' : 'max-h-1250'}
        `}
      >
        {visibleImages.map((image, index) => (
          <div key={index} className='aspect-video bg-gray-600 rounded overflow-hidden group'>
            <img
              src={image}
              alt={`Catálogo ${index}`}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
            />
          </div>
        ))}
      </div>

      {!isExpanded && (
        <div className='absolute bottom-0 w-full h-32 bg-linear-to-t from-black via-black/80 to-transparent flex items-end justify-center pb-4'>
          <button
            onClick={() => setIsExpanded(true)}
            className='font-medium text-white'
          >
            Ver mais novidades
          </button>
        </div>
      )}
    </section>
  );
}

export default ListCard;