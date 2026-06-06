import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

function Carousel({ items = [] }) {

  const navigate = useNavigate();
  const carouselSize = items.length;
  
  return (
    <div className='w-full'>
      {carouselSize === 0 ? (
        <div className='flex items-center justify-center h-48 bg-zinc-900 rounded-2xl border border-dashed border-white/10'>
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
          className='custom-swiper'
        >
          {items.map((item, index) => (
            <SwiperSlide key={item._id || index} className='overflow-visible'>
              <div className='aspect-video relative bg-zinc-900 rounded-2xl overflow-hidden group border border-white/5 hover:border-purple-600/50 shadow-lg hover:shadow-purple-600/20 transition-all duration-500 cursor-pointer' 
                onClick={() => navigate(`/info/${item._id}`)}>
                <img 
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                  src={getImageUrl(item.img_capa)} 
                  alt={item.titulo || `Slide ${index + 1}`} 
                />
                {/* Gradient overlay for better text contrast */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none' />
                {/* Title with z-index and subtle hover lift micro-animation */}
                <p className='absolute bottom-0 left-0 w-full font-bold text-md p-4 text-gray-100 z-20 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'>
                  {item.titulo}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Estilizacao do swiper */}
      <style>{`
        .custom-swiper {
          padding-top: 12px !important;
          padding-bottom: 48px !important;
        }
        .custom-swiper .swiper-wrapper {
          align-items: flex-start;
        }
        .custom-swiper .swiper-pagination {
          bottom: 12px !important;
        }
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