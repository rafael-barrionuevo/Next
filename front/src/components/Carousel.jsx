import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function Carousel({ imgLink = [] }) {
  const carouselSize = imgLink.length;
  
  return (
    <div className='w-full'>
      {carouselSize === 0 ? (
        <div className='flex items-center justify-center h-48 bg-[#1a1a1c] rounded-2xl border border-dashed border-white/10'>
          <p className='text-gray-500 font-medium'>Não há filmes no catálogo</p>
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ 
            clickable: true,
            dynamicBullets: true
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          slidesPerView={1.2}
          centeredSlides={false}
          breakpoints={{
            500: { slidesPerView: 2, spaceBetween: 12 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          spaceBetween={10}
          className='rounded-2xl pb-10 custom-swiper'
        >
          {imgLink.map((link, index) => (
            <SwiperSlide key={index} className='overflow-visible'>
              <div className='relative group cursor-pointer'>
                {/* Overlay de gradiente interno para destacar possíveis textos futuros */}
                <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                
                <img 
                  className='w-full aspect-video object-cover rounded-2xl border border-white/5 group-hover:border-purple-600/50 shadow-lg group-hover:shadow-purple-600/20 transition-all duration-500' 
                  src={link} 
                  alt={`Slide ${index + 1}`} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Estilizacao do swiper */}
      <style>{`
        .custom-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
        }
        .custom-swiper .swiper-pagination-bullet-active {
          background: #9333ea !important; /* Seu roxo vibrante */
          width: 20px;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Carousel;