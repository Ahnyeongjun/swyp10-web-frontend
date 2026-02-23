import { Icon } from '@iconify/react';
import Image from 'next/image';

import ThemeTag from './theme-tag';

interface HorizontalFestivalListItemProps {
  image: string;
  theme: string;
  title: string;
  location: string;
  isMarked?: boolean;
  onClick?: () => void;
}

export default function HorizontalFestivalListItem(
  props: HorizontalFestivalListItemProps,
) {
  const { image, theme, title, location, isMarked = false, onClick } = props;

  return (
    <div
      className='flex w-[140px] shrink-0 cursor-pointer flex-col gap-2'
      onClick={onClick}
    >
      <div className='relative h-[140px] w-[140px]'>
        <Image
          src={image || '/image/text-logo.png'}
          alt={title}
          className='h-[140px] w-[140px] rounded-lg object-cover'
          fill
        />
        <div className='absolute top-2 right-2'>
          {isMarked ? (
            <Icon
              icon='mynaui:star-solid'
              className='text-yellow'
              fontSize={20}
            />
          ) : (
            <Icon
              icon='mynaui:star'
              className='text-white drop-shadow-sm'
              fontSize={20}
            />
          )}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <ThemeTag type={theme} />
        <h3 className='line-clamp-2 text-sm leading-[18px] font-medium text-[#090a0c]'>
          {title}
        </h3>
        <p className='truncate text-xs text-[#868c98]'>{location}</p>
      </div>
    </div>
  );
}
