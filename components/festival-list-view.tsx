'use client';

import { useState } from 'react';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { useBookmark } from '@/hooks/useBookmark';
import { displayDate } from '@/utils/displayDate';

import { dialogClose, dialogOpen } from './Dialog';
import ThemeTag from './theme-tag';

interface FestivalListViewProps {
  image: string;
  theme: string;
  title: string;
  loc: string;
  start_date: string;
  end_date: string;
  is_marked: boolean;
  id: number;
  map_x: string;
  map_y: string;
  onBookmarkRemove?: (id: number) => void;
}

export default function FestivalListView(props: FestivalListViewProps) {
  const {
    image,
    theme,
    title,
    loc,
    start_date,
    end_date,
    is_marked,
    id,
    map_x,
    map_y,
    onBookmarkRemove,
  } = props;
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  const [isMarked, setIsMarked] = useState(is_marked);

  const { toggleBookmark } = useBookmark({
    onSuccess: (festivalId, isBookmarked) => {
      setIsMarked(isBookmarked);
      if (!isBookmarked && onBookmarkRemove) {
        onBookmarkRemove(festivalId);
      }
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
    <Link href={`/festival/${id}`} className='block w-full'>
      <div className='flex w-full gap-4'>
        <Image
          src={image || '/image/text-logo.png'}
          alt='festival'
          className='aspect-square h-[108px] w-[108px] rounded-sm object-cover'
          width={108}
          height={108}
        />
        <div className='flex w-full flex-col'>
          <div className='flex w-full items-center justify-between'>
            <ThemeTag type={theme} />
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
          {/* NOTE: 디자인 상 줄바꿈이 고려되지 않아 시간 상 1줄로 지정 */}
          <p className='mt-1 mb-3 line-clamp-1 ui-text-sub-head'>{title}</p>
          <div className='mb-1 flex items-center justify-between'>
            <div className='flex w-3/4 items-center'>
              <Icon
                icon='carbon:location-filled'
                className='cursor-pointer text-gray-300'
                fontSize={20}
              />
              <p className={`mr-1 ml-0.5 line-clamp-1 ui-text-body-2`}>{loc}</p>
            </div>
            <p
              className='line-clamp-1 w-[50px] ui-text-body-2 underline'
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
                router.push(
                  `/${params.toString() ? `?${params.toString()}` : ''}`,
                );
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
              {displayDate(start_date)} ~ {displayDate(end_date)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
