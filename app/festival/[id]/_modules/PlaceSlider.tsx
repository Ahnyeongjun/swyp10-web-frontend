import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

interface PlaceSliderProps {
  places: {
    image: string;
    name: string;
    distance: string;
  }[];
}

export default function PlaceSlider({ places }: PlaceSliderProps) {
  return (
    <Swiper
      spaceBetween={8}
      slidesPerView='auto'
      className='w-full'
      direction='horizontal'
    >
      {places.map((place, index) => (
        <SwiperSlide key={index} className='!w-[148px] flex-shrink-0'>
          <div className='w-[148px]'>
            <Image
              src={place?.image || '/image/text-logo.png'}
              alt={place.name}
              width={148}
              height={148}
              className='mb-2 h-[148px] w-[148px] rounded-lg object-cover'
            />
            <div className='w-[148px] overflow-hidden'>
              <p className='h-5 truncate text-[14px] leading-[20px] font-semibold tracking-[-0.14px] text-[#090a0c]'>
                {place.name}
              </p>
              <p className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] whitespace-nowrap text-[#5e6573]'>
                {place.distance}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
