import NavBar from '../components/NavBar.jsx'
import FooNavBar from '../components/FooNavBar.jsx'
import Carousel from '../components/Carousel.jsx'
import ListCard from '../components/ListCard.jsx'

import posterImages from '../constants/posterImages'

import { useDispatch } from 'react-redux'
import { adicionarWishlist } from '../store/userSlice'

function Filme() {
  const dispatch = useDispatch()

  const handleAddWishlist = (id) => {
    dispatch(adicionarWishlist(id))
  }

  const sections = [
    {
      title: "Lançamentos",
      data: posterImages.slice(1, 7)
    },
    {
      title: "Ação e Aventura",
      data: posterImages.slice(15, 21)
    },
    {
      title: "Ficção Científica",
      data: posterImages.slice(2, 8)
    },
    {
      title: "Filmes Clássicos",
      data: posterImages.slice(32, 38)
    }
  ]

  const carouselImgLink = posterImages.slice(10, 19)

  return (
    <div className='flex flex-col min-h-screen bg-[#0d1117] relative pb-20'>
      
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none'></div>

      <NavBar />
      
      <div className='flex-1 relative z-10 px-4 max-w-7xl mx-auto w-full space-y-10 mt-4'>
        
        {/* Destaques */}
        <section>
          <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
            Filmes em Destaque
          </h1>
          <Carousel imgLink={carouselImgLink} />
        </section>

        {/* Categorias de Filmes */}
        {sections.map((section, index) => (
          <section key={index}>
            <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
              {section.title}
            </h1>

            <ListCard 
              imgLink={section.data} 
              onAddWishlist={handleAddWishlist}
            />
          </section>
        ))}

      </div>

      <FooNavBar />
    </div>
  )
}

export default Filme
