import NavBar from '../components/NavBar.jsx'
import FooNavBar from '../components/FooNavBar.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import SectionTabs from '../components/SectionTabs.jsx'

import { useDispatch, useSelector } from 'react-redux'
import { listarConteudos } from '../store/contentSlice'
import { useEffect, useMemo } from 'react'

function dailyRandomIndex(arrayLength) {
  if (arrayLength <= 0) return 0
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return seed % arrayLength
}

function HomePage() {
  const dispatch = useDispatch()
  const contents = useSelector(state => state.content.items)
  const status = useSelector(state => state.content.status)
  const isLoading = status === 'idle' || status === 'loading'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(listarConteudos())
    }
  }, [status, dispatch])

  // Para adicionar uma seção nova, basta incluir mais um objeto aqui:
  const sectionsFilmes = useMemo(() => [
    { title: "Filmes", data: contents.filter(c => c.tipo_midia === 'filme'), link: '/filme' },
    {
      title: "Ação", data: contents.filter(c => {
        return c.tipo_midia === 'filme' && c.genero?.includes('Ação')
      }), link: '/filme'
    },
    {
      title: "Drama", data: contents.filter(c => {
        return c.tipo_midia === 'filme' && c.genero?.includes('Drama')
      }), link: '/filme'
    },
  ], [contents])

  const sectionsSeries = useMemo(() => [
    { title: "Séries", data: contents.filter(c => c.tipo_midia === 'serie'), link: '/serie' },
    {
      title: "Ação", data: contents.filter(c => {
        return c.tipo_midia === 'serie' && c.genero?.includes('Ação')
      }), link: '/serie'
    },
    {
      title: "Drama", data: contents.filter(c => {
        return c.tipo_midia === 'serie' && c.genero?.includes('Drama')
      }), link: '/serie'
    },
  ], [contents])

  // Destaque do dia — sorteia um conteúdo diferente a cada dia
  const heroItem = useMemo(() => {
    if (contents.length === 0) return null
    const index = dailyRandomIndex(contents.length)
    return contents[index]
  }, [contents])

  return (
    <div className='flex min-h-screen flex-col bg-slate-900 pb-20'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none' />

      <NavBar />
      <HeroBanner item={heroItem} label='Destaque do dia' loading={isLoading} />

      <div className='relative z-10 mx-auto mt-6 w-full max-w-7xl flex-1 space-y-8 px-4'>
        <SectionTabs sections={sectionsFilmes} loading={isLoading} />
        <SectionTabs sections={sectionsSeries} loading={isLoading} />
      </div>

      <FooNavBar />
    </div>
  )
}

export default HomePage