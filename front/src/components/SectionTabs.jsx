import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';

/**
 * Barra de abas que alterna entre seções de conteúdo.
 *
 * @param {{ sections: Array<{ title: string, data: any[], link: string }>, loading: boolean }} props
 *
 * Para adicionar uma nova seção basta incluir mais um objeto no array `sections`
 * que é passado por props — nenhuma alteração neste componente é necessária.
 * Seções sem dados são ocultadas automaticamente.
 */
function SectionTabsSkeleton() {
  return (
    <>
      {/* Tab bar skeleton */}
      <div className='flex items-center gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10'>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className='flex-1 h-10 bg-white/8 rounded-lg animate-pulse' />
        ))}
      </div>

      {/* Carousel skeleton */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='h-6 w-32 bg-white/10 rounded-md animate-pulse' />
          <div className='h-4 w-24 bg-white/8 rounded-md animate-pulse' />
        </div>
        <div className='flex gap-3 overflow-hidden'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='flex-shrink-0 w-[280px] aspect-video bg-white/5 rounded-2xl animate-pulse' />
          ))}
        </div>
      </div>
    </>
  );
}

function SectionTabs({ sections = [], loading = false }) {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  // Filtra seções que possuem pelo menos 1 item
  const visibleSections = sections.filter(s => s.data.length > 0);

  // Reseta a aba ativa se ficou fora do range após filtrar
  useEffect(() => {
    if (activeTab >= visibleSections.length && visibleSections.length > 0) {
      setActiveTab(0);
    }
  }, [visibleSections.length, activeTab]);

  if (loading) return <SectionTabsSkeleton />;
  if (visibleSections.length === 0) return null;

  const current = visibleSections[activeTab] || visibleSections[0];

  return (
    <>
      {/* Tab bar */}
      <div className='flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-x-auto'>
        {visibleSections.map((section, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              flex-1 min-w-[100px] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap
              ${activeTab === index
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)]'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Active section carousel */}
      <section className="mb-16">
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-white/90 border-l-4 border-purple-600 pl-3'>
            {current.title}
          </h2>
          <button
            onClick={() => navigate(current.link)}
            className='text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 cursor-pointer'
          >
            Ver todos →
          </button>
        </div>
        <Carousel items={current.data} />
      </section>
    </>
  );
}

export default SectionTabs;
