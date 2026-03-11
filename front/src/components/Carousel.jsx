import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Carousel({ imgLink = [] }) {
  const carouselSize = imgLink.length;
  
  return (
    <>
      <div className='w-full rounded-2xl'>
        {carouselSize === 0 && <p>Não há filmes no catálogo</p>}
        {carouselSize > 0 && (
          <Swiper
            modules={[Pagination]}
            
            pagination={{ clickable: true }}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            spaceBetween={16}
            className='rounded-2xl'
          >
            {imgLink.map((link, index) => (
              <SwiperSlide key={index}>
                <img 
                  className='w-full aspect-video object-cover rounded-2xl' 
                  src={link} 
                  alt={`Slide ${index + 1}`} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  )
}
export default Carousel