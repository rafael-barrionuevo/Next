import NavBar from '../components/NavBar.jsx'
import FooNavBar from '../components/FooNavBar.jsx'
import Carousel from '../components/Carousel.jsx'
import ListCard from '../components/ListCard.jsx'

import { useDispatch, useSelector } from 'react-redux'
import { adicionarWishlist } from '../store/userSlice'
import { listarConteudos } from '../store/contentSlice'
import { useEffect } from 'react'

function Filme() {
  const dispatch = useDispatch()
  const contents = useSelector(state => state.content.items)
  const status = useSelector(state => state.content.status)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(listarConteudos())
    }
  }, [status, dispatch])

  const filmes = contents.filter(c => c.tipo_midia === 'filme')

  const handleAddWishlist = (id) => {
    dispatch(adicionarWishlist(id))
  }

  const sections = [
    {
      title: "Lançamentos",
      data: filmes.slice(0, 6)
    },
    {
      title: "Ação e Aventura",
      data: filmes.filter(c => c.genero?.includes('Ação') || c.genero?.includes('Aventura')).slice(0, 6)
    },
    {
      title: "Ficção Científica",
      data: filmes.filter(c => c.genero?.includes('Ficção Científica')).slice(0, 6)
    },
    {
      title: "Filmes Clássicos",
      data: filmes.slice(4, 10) // Just to have different slices
    }
  ]

  const carouselItems = filmes.slice(0, 9)

  return (
    <div className='flex min-h-screen flex-col bg-slate-900 pb-20'>
      
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none'></div>

      <NavBar />
      
      <div className='relative z-10 mx-auto mt-4 w-full max-w-7xl flex-1 space-y-10 px-4'>
        
        {/* Destaques */}
        <section>
          <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
            Filmes em Destaque
          </h1>
          <Carousel items={carouselItems} />
        </section>

        {/* Categorias de Filmes */}
        {sections.map((section, index) => (
          <section key={index}>
            <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
              {section.title}
            </h1>

            <ListCard 
              items={section.data} 
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
