'use client';

import { Icon } from '@iconify/react';

import { useShareThisPage } from '@/hooks/useShareThisPage';
import { cn } from '@/lib/utils';

interface FestivalHeaderProps {
  theme: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  location: string;
  isBookmarked?: boolean;
  onClickBookmark?: () => void;
  onClickMap?: () => void;
}

export default function FestivalHeader({
  theme,
  title,
  subtitle,
  startDate,
  endDate,
  location,
  isBookmarked = false,
  onClickBookmark,
  onClickMap,
}: FestivalHeaderProps) {
  const { share } = useShareThisPage();

  return (
    <div className='px-4 py-6'>
      <div className='flex w-full items-start justify-between'>
        <div className='flex w-[214px] flex-col items-start gap-2'>
          <div className='flex items-center justify-center rounded bg-[#f8e8ff] px-1 py-0.5'>
            <span className='ui-text-sub-head-3 text-violet-500'>{theme}</span>
          </div>
          <div className='flex w-full flex-col items-start gap-0.5'>
            <h2 className='ui-text-head-2 text-black'>{title}</h2>
            <p className='ui-text-body-2 ui-text-color-sub'>{subtitle}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Icon
            icon={isBookmarked ? 'mynaui:star-solid' : 'mynaui:star'}
            className={cn(
              'cursor-pointer',
              isBookmarked ? 'text-yellow' : 'text-gray-300',
            )}
            fontSize={24}
            onClick={onClickBookmark}
          />
          <Icon
            icon='lucide:share'
            className='cursor-pointer text-gray-300'
            fontSize={24}
            onClick={share}
          />
        </div>
      </div>

      <div className='mt-6 flex flex-col gap-2'>
        <div className='flex items-center gap-1'>
          <Icon icon='uis:calendar' className='text-gray-300' fontSize={16} />
          <span className='ui-text-body-2 ui-text-color-info'>
            {startDate} ~ {endDate}
          </span>
        </div>
        <div className='flex w-full items-start gap-1'>
          <Icon
            icon='carbon:location-filled'
            className='text-gray-300'
            fontSize={16}
          />
          <div className='flex w-[283px] flex-col gap-0.5'>
            <p className='ui-text-body-2 ui-text-color-info'>{location}</p>
            <button
              type='button'
              className='text-left ui-text-sub-head-3 ui-text-color-sub underline'
              onClick={onClickMap}
            >
              지도보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
