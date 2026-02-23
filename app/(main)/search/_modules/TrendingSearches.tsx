'use client';

import { useQuery } from '@tanstack/react-query';

import { topKeyWords } from '@/apis/queries';

import { TrendingSearchItem } from './TrendingSearchItem';
import { transformApiDataToTrendingItems } from './types';

interface TrendingSearchesProps {
  onSearch: (keyword: string) => void;
}

export function TrendingSearches({ onSearch }: TrendingSearchesProps) {
  const {
    data: topKeywordsData,
    isLoading: isLoadingKeywords,
    error: keywordsError,
  } = useQuery(topKeyWords(10));

  const trendingItems = topKeywordsData?.data?.content
    ? transformApiDataToTrendingItems(topKeywordsData.data.content)
    : [];

  return (
    <>
      <div className='mb-5'>
        <h2 className='text-[14px] leading-[20px] font-semibold tracking-[-0.14px] text-[#090a0c]'>
          인기 검색어
        </h2>
      </div>

      <div className='flex flex-col gap-3'>
        {isLoadingKeywords && (
          <div className='py-8 text-center'>
            <p className='text-[14px] text-[#868c98]'>로딩 중...</p>
          </div>
        )}

        {keywordsError && (
          <div className='py-8 text-center'>
            <p className='text-[14px] text-[#868c98]'>
              인기 검색어를 불러올 수 없습니다.
            </p>
          </div>
        )}

        {!isLoadingKeywords && !keywordsError && trendingItems.length === 0 && (
          <div className='py-8 text-center'>
            <p className='text-[14px] text-[#868c98]'>
              인기 검색어가 없습니다.
            </p>
          </div>
        )}

        {trendingItems.map(item => (
          <TrendingSearchItem key={item.id} item={item} onSearch={onSearch} />
        ))}
      </div>
    </>
  );
}
