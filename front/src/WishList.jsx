import React from 'react';
import NavBar from './components/NavBar.jsx';
import FooNavBar from './components/FooNavBar.jsx';
function WishList(){
   const myWishlist = [
    { id: 1, title: 'Demon Slayer', imgUrl: 'https://picsum.photos/800/450/?blur?random=1' },
    { id: 2, title: 'Flash', imgUrl: 'https://picsum.photos/800/450/?random=2' },
    { id: 3, title: 'Meu amigo Totoro', imgUrl: 'https://picsum.photos/800/450/?random=3' },
    { id: 4, title: 'Monstros', imgUrl: 'https://picsum.photos/800/450/?blur?random=4' },
    { id: 5, title: 'Corra!', imgUrl: 'https://picsum.photos/800/450/?random=5' },
    { id: 6, title: 'Madagascar', imgUrl: 'https://picsum.photos/800/450/?random=6' },
  ];

  return (
    <div className='flex flex-col min-h-screen bg-[#0d1117] relative pb-20 md:pb-0'>
      {}
      <div className='fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none'></div>

      {}
      <NavBar />

      {}
      <main className='flex-1 relative z-10 px-4 md:px-8 max-w-7xl mx-auto w-full pt-6 md:pt-10'>
        <h1 className='text-2xl md:text-4xl font-bold text-white mb-6 md:mb-10'>
          Minha lista
        </h1>

        {}
        <div className='flex flex-col space-y-4 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-10 md:space-y-0'>
          {myWishlist.map((item) => (
            <div key={item.id} className='flex items-center gap-4 md:block group cursor-pointer'>
              
              {}
              <div className='w-40 md:w-full flex-shrink-0 aspect-video rounded-md overflow-hidden relative'>
                <img 
                  src={item.imgUrl} 
                  alt={item.title} 
                  className='w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105' 
                />
              </div>

              {}
              <div className='flex-1 md:hidden'>
                <h2 className='text-white/90 font-semibold text-lg'>{item.title}</h2>
              </div>

              {}
              <div className='pr-2 md:hidden'>
                <button className='w-12 h-12 rounded-full border-[1.5px] border-white/70 flex items-center justify-center hover:bg-white/10 transition-colors'>
                  {}
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>

      {}
      
        <FooNavBar />
      

      {}
      
    </div>
  );
}
export default WishList;