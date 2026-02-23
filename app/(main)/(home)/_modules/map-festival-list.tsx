'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';
import FestivalListView from '@/components/festival-list-view';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn/drawer';
import type { Festival, MapQueryParams } from '@/types/map';

interface MapFestivalListProps {
  festivals: Festival[];
  isLoadingFestivals: boolean;
  onReloadWithNewQueryParams: (params: MapQueryParams) => void;
  onBookmarkRemove?: (id: number) => void;
}

export default function MapFestivalList({
  festivals,
  isLoadingFestivals,
  onReloadWithNewQueryParams,
  onBookmarkRemove,
}: MapFestivalListProps) {
  const openRef = useRef<HTMLDivElement>(null);
  const [activeSnapPoint, setActiveSnapPoint] = useState<
    number | string | null
  >(0.5);

  const searchParams = useSearchParams();

  // URL 쿼리 파라미터를 MapQueryParams 형태로 변환
  const currentQueryParams = useMemo((): MapQueryParams => {
    return {
      status: (searchParams.get('status') || 'ALL') as string,
      period: (searchParams.get('period') || 'ALL') as string,
      withWhom: (searchParams.get('withWhom') || 'ALL') as string,
      theme: (searchParams.get('theme') || 'ALL') as string,
    };
  }, [searchParams]);

  const memoFestivals = useMemo(() => festivals, [festivals]);

  // URL 쿼리 파라미터가 변경될 때마다 축제 데이터 다시 로드
  useEffect(() => {
    if (Object.values(currentQueryParams).some(param => param !== 'ALL')) {
      onReloadWithNewQueryParams(currentQueryParams);
    }
  }, [currentQueryParams, onReloadWithNewQueryParams]);

  useEffect(() => {
    if (openRef?.current) {
      openRef.current.click();
    }
  }, [openRef]);

  return (
    <Drawer
      snapPoints={[0.5, 1]}
      modal={false}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
    >
      <div className='absolute right-4 bottom-20 flex items-center gap-2'>
        <DrawerTrigger asChild>
          <Button size={'sm'} variant='primary' rounded='full'>
            리스트로 보기
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerHeader>
        <DrawerTitle></DrawerTitle>
      </DrawerHeader>
      <DrawerContent className='z-[1] h-full'>
        {isLoadingFestivals ? (
          <div className='flex flex-col items-center justify-center pt-20'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
            <p className='mt-4 ui-text-body text-gray-500'>
              축제를 불러오는 중...
            </p>
          </div>
        ) : memoFestivals && memoFestivals.length > 0 ? (
          <div className='flex h-full w-full items-center justify-center'>
            <div className='flex h-full w-full max-w-[600px] flex-col px-5 pb-[100px]'>
              <div className='flex-shrink-0 py-4'>
                <p className='ui-text-head-2'>
                  {memoFestivals.length}개의 축제
                </p>
              </div>
              <div className='flex-1 overflow-y-auto'>
                <div className='box-border flex w-full flex-col items-center justify-center gap-5 py-1'>
                  {memoFestivals.map(festival => (
                    <FestivalListView
                      key={festival?.id || ''}
                      image={festival?.image || ''}
                      theme={festival.theme}
                      title={festival?.title || ''}
                      loc={festival?.loc || ''}
                      start_date={festival?.start_date || ''}
                      end_date={festival?.end_date || ''}
                      is_marked={festival?.is_marked || false}
                      id={festival?.id || 0}
                      map_x={festival?.map_x.toString() || ''}
                      map_y={festival?.map_y.toString() || ''}
                      onBookmarkRemove={onBookmarkRemove}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center ${Number(activeSnapPoint) > 0.5 ? 'pt-20' : ''}`}
          >
            <Image
              src={'/image/no-list/no-festival-list.png'}
              alt='no-festival-list'
              width={68}
              height={68}
            />
            <p className='mt-5 ui-text-sub-head text-gray-700'>
              해당 지역에 축제가 없습니다.
            </p>
            <p className='mt-1 ui-text-body-2 text-gray-400'>
              지도를 이동하거나 필터를 변경해보세요.
            </p>
          </div>
        )}
      </DrawerContent>
      <DrawerTrigger asChild>
        <div ref={openRef} className='hidden' />
      </DrawerTrigger>
    </Drawer>
  );
}
