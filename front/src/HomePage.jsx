import './HomePage.css'
import NavBar from './components/NavBar.jsx'
import FooNavBar from './components/FooNavBar.jsx'
import Carousel from './components/Carousel.jsx'
import ListCard from './components/ListCard.jsx'
function HomePage() {
  const imgLink = [
    'https://picsum.photos/800/1200/?blur?random=1',
    'https://picsum.photos/id/870/800/1200?grayscale&',
    'https://picsum.photos/800/1200/?random=2',
    'https://picsum.photos/800/1200/?random=3',
    'https://picsum.photos/800/1200/?blur?random=4',
    'https://picsum.photos/800/1200/?blur?random=5',
    'https://picsum.photos/800/1200/?random=6',
    'https://picsum.photos/800/1200/?random=7',
    'https://picsum.photos/800/1200/?blur?random=8',
    'https://picsum.photos/800/1200/?blur?random=9',
    'https://picsum.photos/800/1200/?random=10',
    'https://picsum.photos/800/1200/?random=11',
    'https://picsum.photos/800/1200/?blur?random=12',
    'https://picsum.photos/800/1200/?blur?random=13'
  ];
  const carouselImgLink = [
    'https://picsum.photos/800/1200/?blur?random=14',
    'https://picsum.photos/800/1200/?random=15',
    'https://picsum.photos/800/1200/?random=16',
    'https://picsum.photos/800/1200/?random=17',
    'https://picsum.photos/800/1200/?random=18',
  ]
  return (
    <div className='flex flex-col min-h-screen bg-[#0d1117] relative pb-20'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none'></div>

      <NavBar />
      
      <div className='flex-1 relative z-10 px-4 max-w-7xl mx-auto w-full space-y-8 mt-4'>
        <section>
          <h1 className='text-xl font-semibold text-white/90 mb-4 border-l-4 border-purple-600 pl-3'>
            Filmes Populares
          </h1>
          <Carousel imgLink={carouselImgLink} />
        </section>

        <section>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-xl font-semibold text-white/90 border-l-4 border-purple-600 pl-3'>
              Novo na Next
            </h1>
          </div>
          <ListCard imgLink={imgLink} />
        </section>
      </div>

      
        <FooNavBar />
      
    </div>
  )
}

export default HomePage
