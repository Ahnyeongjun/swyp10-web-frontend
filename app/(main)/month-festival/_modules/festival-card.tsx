'use client';

import { useState } from 'react';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { GetMonthlyFestivalResponse } from '@/apis/SWYP10BackendAPI.schemas';
import { Button } from '@/components/Button';
import { dialogClose, dialogOpen } from '@/components/Dialog';
import ThemeTag from '@/components/theme-tag';
import { useAuth } from '@/hooks/useAuth';
import { useBookmark } from '@/hooks/useBookmark';
import { displayDate } from '@/utils/displayDate';

export default function FestivalCard({
  index,
  festival,
}: {
  index: number;
  festival: GetMonthlyFestivalResponse;
}) {
  const {
    id,
    title,
    address,
    map_x,
    map_y,
    startDate,
    endDate,
    overview,
    thumbnail,
    bookmarked,
  } = festival;
  const [isOpen, setIsOpen] = useState(false);
  const [isMarked, setIsMarked] = useState(!!bookmarked);
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  const { toggleBookmark } = useBookmark({
    onSuccess: (festivalId, isBookmarked) => {
      setIsMarked(isBookmarked);
    },
  });

  const handleBookmark = async (type: 'add' | 'cancel') => {
    if (type === 'add') {
      await toggleBookmark(id, false);
    } else {
      await toggleBookmark(id, true);
    }
  };

  return (
    <div className='flex w-full flex-col justify-center'>
      <div className='flex w-full items-center gap-1'>
        <Image
          src={'/image/ranking.png'}
          alt='ranking'
          width={24}
          height={24}
        />
        <p className='mt-2 ui-text-sub-head text-[#ff8757]'>BEST {index}</p>
      </div>
      <Image
        src={thumbnail || '/image/text-logo.png'}
        className='h-full w-full rounded-md object-cover'
        alt='festival-image'
        style={{
          aspectRatio: '16/9',
        }}
        width={600}
        height={600}
      />
      <div className='my-2 flex w-full items-center justify-between'>
        <ThemeTag type={'MUSIC'} />
        <div className='flex gap-2'>
          {isMarked ? (
            <Icon
              icon='mynaui:star-solid'
              className='cursor-pointer text-yellow'
              fontSize={20}
              onClick={async e => {
                e.preventDefault();
                e.stopPropagation();
                if (isLoading) return;
                await handleBookmark('cancel');
              }}
            />
          ) : (
            <Icon
              icon='mynaui:star'
              className='cursor-pointer text-gray-300'
              fontSize={20}
              onClick={async e => {
                e.preventDefault();
                e.stopPropagation();
                if (isLoading) return;
                if (!isLoggedIn) {
                  dialogOpen({
                    title: '로그인이 필요한 기능입니다.',
                    type: 'confirm',
                    onApply: () => {
                      dialogClose();
                      router.push('/login');
                    },
                  });
                } else {
                  await handleBookmark('add');
                }
              }}
            />
          )}
          <Icon
            icon='lucide:share'
            className='cursor-pointer text-gray-300'
            fontSize={20}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              try {
                if (typeof window === 'undefined') return;
                window.navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_WEB_URL}/festival/${id}`,
                );
                dialogOpen({
                  title: '링크가 복사되었습니다.',
                  type: 'alert',
                  onApply: () => {
                    dialogClose();
                  },
                });
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </div>
      </div>
      <p className='ui-text-sub-head'>{title}</p>
      <div className='my-2 flex items-center justify-between'>
        <div className='flex w-3/4 items-center'>
          <Icon
            icon='carbon:location-filled'
            className='cursor-pointer text-gray-300'
            fontSize={20}
          />
          <p className={`mr-1 ml-0.5 line-clamp-1 ui-text-body-2`}>{address}</p>
        </div>
        <p
          className='line-clamp-1 ui-text-body-2 underline'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            const mapX = map_x ? String(map_x) : '';
            const mapY = map_y ? String(map_y) : '';
            const params = new URLSearchParams();
            if (mapX && mapY) {
              params.set('mapX', mapX);
              params.set('mapY', mapY);
              params.set('zoom', '13'); // 상세 보기 적당 줌
            }
            if (id) params.set('focusId', String(id));
            router.push(`/${params.toString() ? `?${params.toString()}` : ''}`);
          }}
        >
          지도보기
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <Icon
          icon='uis:calendar'
          className='cursor-pointer text-gray-300'
          fontSize={20}
        />
        <p className='mr-1 ml-0.5 ui-text-body-2'>
          {displayDate(startDate)} ~ {displayDate(endDate)}
        </p>
      </div>
      <p
        className={`${isOpen ? '' : 'line-clamp-3'} mb-1 ui-text-body-2-long text-gray-700`}
      >
        {overview}
      </p>
      <div className='mt-2 flex w-full'>
        <Button variant='ghost' onClick={() => setIsOpen(prev => !prev)}>
          <p className='ui-text-body-2 text-gray-300'>
            {isOpen ? '설명 닫기' : '설명 더보기'}
          </p>
          <Icon
            icon={isOpen ? 'jam:chevron-up' : 'jam:chevron-down'}
            className='cursor-pointer text-gray-300'
            fontSize={16}
          />
        </Button>
      </div>
    </div>
  );
}
