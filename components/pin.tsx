import { Icon } from '@iconify/react';
import Image from 'next/image';

import themeList from '@/constants/themeList';

import ThemeTag from './theme-tag';

interface PinProps {
  type: string;
  variant: 'default' | 'detail';

  // 디테일 핀
  image?: string;
  title?: string;
  is_marked?: boolean;
  id?: string;
}
export default function Pin(props: PinProps) {
  const { type, variant } = props;

  if (variant === 'default') {
    const image = themeList.find(theme => theme.type === type)?.image || '';
    switch (type) {
      case 'CULTURE_ART':
        return <Image src={image} alt={type} width={36} height={36} />;
      case 'FOOD':
        return <Image src={image} alt={type} width={36} height={36} />;
      case 'MUSIC':
        return <Image src={image} alt={type} width={36} height={36} />;
      case 'NATURE':
        return <Image src={image} alt={type} width={36} height={36} />;
      case 'TRADITION':
        return <Image src={image} alt={type} width={36} height={36} />;
    }
  } else {
    const { image, title, is_marked, id } = props;
    if (!image || !title || !id) return null;

    return (
      <div
        className='box-border flex h-[64px] w-[224px] items-center gap-2 rounded-lg bg-white py-2 pr-3 pl-2'
        style={{
          boxShadow: '0 0 5px 0 rgba(0,0,0,0.18)',
        }}
      >
        <Image
          src={image}
          alt={title}
          width={48}
          height={48}
          className='aspect-square rounded-sm object-cover'
        />
        <div className='flex w-full flex-col justify-center gap-1'>
          <div className='flex w-full items-center justify-between'>
            <ThemeTag type={type} />
            {is_marked ? (
              <Icon
                icon='mynaui:star-solid'
                className='cursor-pointer text-yellow'
                fontSize={20}
              />
            ) : (
              <Icon
                icon='mynaui:star'
                className='cursor-pointer text-gray-300'
                fontSize={20}
              />
            )}
          </div>
          <div className='flex items-center'>
            <p className='line-clamp-1 ui-text-head-2'>{title}</p>
            <Icon
              icon='jam:chevron-right'
              className='cursor-pointer text-gray-300'
              fontSize={16}
            />
          </div>
        </div>
      </div>
    );
  }
}
