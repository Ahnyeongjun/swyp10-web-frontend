'use client';

import { use } from 'react';

import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';

import { festivalRestaurants } from '@/apis/queries';

interface Props {
  params: Promise<{ id: string }>;
}

function RestaurantItem({
  restaurant,
}: {
  restaurant: { name: string; address: string; imageUrl: string };
}) {
  return (
    <div className='flex w-full flex-row items-center justify-start gap-3 bg-white'>
      <div className='flex flex-1 flex-col items-start justify-start gap-2 px-2 py-0'>
        <div className='flex flex-row items-center justify-start gap-1'>
          <h4 className='text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-black'>
            {restaurant.name}
          </h4>
        </div>

        <div className='flex w-full flex-col items-end justify-start gap-1'>
          <div className='flex h-9 w-full flex-row items-start justify-start gap-2'>
            <div className='flex flex-row items-center justify-start gap-2.5 p-[2px]'>
              <div className='flex h-4 w-4 items-center justify-center'>
                <Icon
                  icon='mdi:location'
                  fontSize={20}
                  className='text-gray-200'
                />
              </div>
            </div>
            <div className='flex-1 text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#5e6573]'>
              {restaurant.address}
            </div>
          </div>
        </div>
      </div>

      <div className='h-[118px] w-[118px] shrink-0 rounded bg-gray-300'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className='h-full w-full rounded object-cover'
        />
      </div>
    </div>
  );
}

export default function RestaurantList({ params }: Props) {
  const { id } = use(params);
  const festivalId = Number(id);

  const { data } = useQuery(festivalRestaurants(festivalId));
  const items = (data?.data?.content ?? []).map(r => ({
    name: r?.name ?? '가게명',
    address: r?.address ?? '주소 정보 없음',
    imageUrl: r?.imageUrl ?? 'https://picsum.photos/118/118?random=1',
  }));

  if (items.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center rounded bg-[#f8f9fb]'>
        <p className='ui-text-body-2 ui-text-color-sub'>
          주변 맛집 정보가 없어요
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start justify-start gap-5'>
      {items.map((restaurant, index) => (
        <div key={`${restaurant.name}-${index}`} className='w-full'>
          <RestaurantItem restaurant={restaurant} />
          {index < items.length - 1 && (
            <div className='relative mt-5 h-0 w-full'>
              <div className='absolute top-0 right-0 left-0 h-[1px] bg-[#f1f2f4]' />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
