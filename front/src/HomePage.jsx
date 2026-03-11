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
    <div className='flex flex-col min-h-screen bg-slate-900 pb-20'>
      <NavBar />

      <div className='flex-1'>
        <div className='flex flex-col p-2 space-y-4 overflow-hidden'>
          <h1 className='text-2xl font-bold text-white'>Filmes Populares</h1>
          <Carousel imgLink={carouselImgLink} />
        </div>
        <div className='flex flex-col p-2 space-y-4'>
          <h1 className='text-2xl font-bold text-white'>Novo na Next</h1>
          <ListCard imgLink={imgLink} />
        </div>
        <div className='flex flex-col p-2 space-y-4'>
          <h1 className='text-2xl font-bold text-white'>Novo na Next</h1>
          <div className='flex space-x-2'>
            <div className='aspect-1/2 w-1/2 bg-gray-600 rounded'></div>
            <div className='aspect-1/2 w-1/2 bg-gray-600 rounded'></div>
            <div className='aspect-1/2 w-1/2 bg-gray-600 rounded'></div>
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0'>
        <FooNavBar />
      </div>
    </div>
  )
}

export default HomePage
