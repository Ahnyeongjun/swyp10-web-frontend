import Image from 'next/image';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

interface FestivalImageSliderProps {
  images: string[];
}

export default function FestivalImageSlider({
  images,
}: FestivalImageSliderProps) {
  return (
    <div className='relative w-full'>
      <Swiper
        spaceBetween={8}
        slidesPerView='auto'
        className='w-full'
        direction='horizontal'
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className='!w-[156px] flex-shrink-0'>
            <Image
              src={image || '/image/text-logo.png'}
              alt={`축제 이미지 ${index + 1}`}
              className='h-[156px] w-[156px] rounded object-cover'
              width={156}
              height={156}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
