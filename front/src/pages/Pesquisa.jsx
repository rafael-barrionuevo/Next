import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IoMdSearch, IoMdClose } from 'react-icons/io'
import NavBar from '../components/NavBar.jsx'
import FooNavBar from '../components/FooNavBar.jsx'
import ListCard from '../components/ListCard.jsx'
import api from '../services/api.js'

/* ─── Debounce hook ──────────────────────────────────────────────── */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

/* ─── Pesquisa Page ──────────────────────────────────────────────── */
function Pesquisa() {
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef = useRef(null)

  // State
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const g = searchParams.get('genero')
    return g ? g.split(',') : []
  })
  const [tipoMidia, setTipoMidia] = useState(searchParams.get('tipo') || '')
  const [results, setResults] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const debouncedQuery = useDebounce(query, 350)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Fetch search results
  const fetchResults = useCallback(async (q, genero, tipo) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (genero.length > 0) params.set('genero', genero.join(','))
      if (tipo) params.set('tipo_midia', tipo)

      const res = await api.get(`/conteudos/pesquisa?${params.toString()}`)
      setResults(res.data.resultados || [])
      setGenres(res.data.generos || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Trigger search when filters change
  useEffect(() => {
    const shouldSearch = debouncedQuery.length > 0 || selectedGenres.length > 0 || tipoMidia
    if (shouldSearch) {
      setHasSearched(true)
      fetchResults(debouncedQuery, selectedGenres, tipoMidia)

      const params = new URLSearchParams()
      if (debouncedQuery) params.set('q', debouncedQuery)
      if (selectedGenres.length > 0) params.set('genero', selectedGenres.join(','))
      if (tipoMidia) params.set('tipo', tipoMidia)
      setSearchParams(params, { replace: true })
    } else {
      setResults([])
      setHasSearched(false)
      setSearchParams({}, { replace: true })
    }
  }, [debouncedQuery, selectedGenres, tipoMidia, fetchResults, setSearchParams])

  // Load genres on mount
  useEffect(() => {
    api.get('/conteudos/pesquisa').then(res => {
      setGenres(res.data.generos || [])
    }).catch(() => {})
  }, [])

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const clearAll = () => {
    setQuery('')
    setSelectedGenres([])
    setTipoMidia('')
    inputRef.current?.focus()
  }

  const hasActiveFilters = query.length > 0 || selectedGenres.length > 0 || tipoMidia

  // Separate results by type for ListCard sections
  const filmes = results.filter(c => c.tipo_midia === 'filme')
  const series = results.filter(c => c.tipo_midia === 'serie')

  return (
    <div className='flex min-h-screen flex-col bg-slate-900 pb-20'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none' />

      <NavBar />

      <div className='relative z-10 mx-auto mt-4 w-full max-w-7xl flex-1 space-y-8 px-4'>

        {/* ── Search Input ──────────────────────────────────────── */}
        <div>
          <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
            Pesquisar
          </h1>

          <div className='relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 transition-all duration-300'>
            <IoMdSearch className='text-2xl text-white/40 ml-4 shrink-0' />
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Pesquisar filmes, séries...'
              className='w-full bg-transparent text-white placeholder:text-white/30 py-3.5 px-3 outline-none'
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className='mr-3 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer'
              >
                <IoMdClose className='text-lg' />
              </button>
            )}
          </div>
        </div>

        {/* ── Media Type Filter ─────────────────────────────────── */}
        <div className='flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-x-auto'>
          {[
            { label: 'Todos', value: '' },
            { label: 'Filmes', value: 'filme' },
            { label: 'Séries', value: 'serie' },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setTipoMidia(prev => prev === value ? '' : value)}
              className={`
                flex-1 min-w-[100px] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap
                ${tipoMidia === value
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Genre Chips ───────────────────────────────────────── */}
        {genres.length > 0 && (
          <div>
            <h2 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
              Gêneros
            </h2>
            <div className='flex flex-wrap gap-2'>
              {genres.map((genre) => {
                const isActive = selectedGenres.includes(genre)
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border
                      ${isActive
                        ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.25)]'
                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }
                    `}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Clear Filters / Result count ──────────────────────── */}
        {hasActiveFilters && (
          <div className='flex items-center justify-between'>
            <p className='text-sm text-white/50'>
              {loading ? (
                <span className='animate-pulse'>Pesquisando...</span>
              ) : (
                <>
                  <span className='text-white font-bold'>{results.length}</span>
                  {' '}resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
            <button
              onClick={clearAll}
              className='text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer flex items-center gap-1'
            >
              <IoMdClose className='text-base' />
              Limpar filtros
            </button>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────── */}
        {loading ? (
          // Skeleton
          <div className='grid grid-cols-1 min-[500px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className='flex flex-col'>
                <div className='bg-white/5 rounded-lg animate-pulse' style={{ aspectRatio: '2/3' }} />
                <div className='mt-2 h-4 w-3/4 bg-white/8 rounded animate-pulse' />
              </div>
            ))}
          </div>
        ) : hasSearched && results.length === 0 ? (
          // Empty state
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='w-24 h-24 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
              <IoMdSearch className='text-4xl text-white/20' />
            </div>
            <h3 className='text-xl font-bold text-white/80 mb-2'>Nenhum resultado encontrado</h3>
            <p className='text-white/40 max-w-md'>
              Tente pesquisar com outros termos ou selecione gêneros diferentes.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className='space-y-10'>
            {/* If not filtering by type, show separate sections */}
            {tipoMidia === '' ? (
              <>
                {filmes.length > 0 && (
                  <section>
                    <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
                      Filmes
                    </h1>
                    <ListCard items={filmes} linkTo='/filme' />
                  </section>
                )}
                {series.length > 0 && (
                  <section>
                    <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
                      Séries
                    </h1>
                    <ListCard items={series} linkTo='/serie' />
                  </section>
                )}
              </>
            ) : (
              <section>
                <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
                  {tipoMidia === 'filme' ? 'Filmes' : 'Séries'}
                </h1>
                <ListCard items={results} linkTo={tipoMidia === 'filme' ? '/filme' : '/serie'} />
              </section>
            )}
          </div>
        ) : !hasSearched ? (
          // Initial state
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='w-20 h-20 mb-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
              <IoMdSearch className='text-3xl text-purple-400' />
            </div>
            <h3 className='text-lg font-bold text-white/70 mb-2'>Comece a pesquisar</h3>
            <p className='text-white/40 max-w-sm text-sm'>
              Digite o nome de um filme ou série, ou selecione gêneros para explorar o catálogo.
            </p>
          </div>
        ) : null}

      </div>

      <FooNavBar />
    </div>
  )
}

export default Pesquisa
