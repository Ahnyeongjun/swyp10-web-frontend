import { Icon } from '@iconify/react';

import type { TrendingSearchItemProps } from './types';

export function TrendingSearchItem({
  item,
  onSearch,
}: TrendingSearchItemProps) {
  const rankColor = item.rank <= 3 ? '#ff8757' : '#868c98';

  return (
    <div className='relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-start gap-3 p-0'>
      <div className='relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-between p-0'>
        <div className='relative box-border flex shrink-0 flex-row content-stretch items-center justify-start gap-3 p-0 text-left text-[14px] leading-[0] tracking-[-0.14px] text-nowrap not-italic'>
          <div
            className='relative shrink-0 font-semibold'
            style={{ color: rankColor }}
          >
            <p className='leading-[20px] text-nowrap whitespace-pre'>
              {item.rank}
            </p>
          </div>
          <div className='relative shrink-0 font-medium text-[#26282e]'>
            <p className='leading-[20px] text-nowrap whitespace-pre'>
              {item.keyword}
            </p>
          </div>
        </div>
        <button
          onClick={() => onSearch(item.keyword)}
          className='relative size-5 shrink-0 cursor-pointer overflow-clip'
        >
          <Icon icon='lucide:search' className='h-full w-full text-[#5e6573]' />
        </button>
      </div>
      <div className='h-px w-full bg-[#d5d7db]' />
    </div>
  );
}
