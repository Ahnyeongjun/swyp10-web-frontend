import { useEffect, useState } from 'react';

import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { FestivalSummaryResponse } from '@/apis/SWYP10BackendAPI.schemas';
import FestivalListView from '@/components/festival-list-view';
import { FilterChip, SelectedChip } from '@/components/filter-chip';
import { FilterValues } from '@/components/filter-modal';

import { TrendingSearches } from './TrendingSearches';

interface SearchResultsProps {
  results: FestivalSummaryResponse[];
  isLoading: boolean;
  error: unknown;
  searchQuery: string;
  totalCount?: number;
  onSearch: (keyword: string) => void;
  filterValues: FilterValues;
  onFilterClick: () => void;
}

export function SearchResults({
  results,
  isLoading,
  error,
  searchQuery,
  totalCount,
  onSearch,
  filterValues,
  onFilterClick,
}: SearchResultsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isNearbySelected, setIsNearbySelected] = useState(
    searchParams.get('nearby') === 'true',
  );
  const [isThisMonthSelected, setIsThisMonthSelected] = useState(
    searchParams.get('thisMonth') === 'true',
  );

  // 브라우저 히스토리만 업데이트 (RSC 요청 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (isNearbySelected) {
        params.set('nearby', 'true');
      } else {
        params.delete('nearby');
      }

      if (isThisMonthSelected) {
        params.set('thisMonth', 'true');
      } else {
        params.delete('thisMonth');
      }

      const newUrl = `/search?${params.toString()}`;
      const currentUrl = `${window.location.pathname}?${new URLSearchParams(window.location.search).toString()}`;

      if (newUrl !== currentUrl) {
        // RSC 요청을 피하기 위해 history API 직접 사용
        window.history.replaceState(null, '', newUrl);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isNearbySelected, isThisMonthSelected, searchParams]);

  const toggleNearby = () => {
    setIsNearbySelected(prev => !prev);
  };

  const toggleThisMonth = () => {
    setIsThisMonthSelected(prev => !prev);
  };

  // 필터 값 → 라벨 매핑
  const getLabelFromValue = (key: string, value: string): string => {
    const regionLabelMap: Record<string, string> = {
      seoul: '서울',
      gyeonggi: '경기',
      gangwon: '강원',
      chungcheong: '충청',
      jeolla: '전라',
      gyeongsang: '경상',
      jeju: '제주',
    };
    const companionLabelMap: Record<string, string> = {
      family: '가족',
      couple: '커플',
      parents: '부모님',
      pet: '반려견',
      friend: '친구',
    };
    const themeLabelMap: Record<string, string> = {
      culture: '문화/예술',
      food: '음식/미식',
      music: '음악/공연',
      nature: '자연/체험',
      tradition: '전통/역사',
    };

    if (key === 'region') return regionLabelMap[value] || value;
    if (key === 'companion') return companionLabelMap[value] || value;
    if (key === 'theme') return themeLabelMap[value] || value;
    return value;
  };

  const selectedFilterParams: Array<{
    key: 'region' | 'companion' | 'theme';
    value: string | null;
  }> = [
    { key: 'region', value: searchParams.get('region') },
    { key: 'companion', value: searchParams.get('companion') },
    { key: 'theme', value: searchParams.get('theme') },
  ];

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h2 className='mb-5 text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-[#090a0c]'>
          {totalCount || results.length}개의 관련 축제
        </h2>

        <div className='flex flex-row items-start justify-start gap-1'>
          <FilterChip
            label='내 주변'
            is_selected={isNearbySelected}
            onClick={toggleNearby}
          />
          <FilterChip
            label='이번 달 축제'
            is_selected={isThisMonthSelected}
            onClick={toggleThisMonth}
          />
          <FilterChip
            label='필터'
            is_selected={Object.values(filterValues).some(
              value => value !== null,
            )}
            downChevron
            onClick={onFilterClick}
          />
          {selectedFilterParams
            .filter(param => Boolean(param.value))
            .map(param => (
              <SelectedChip
                key={param.key}
                label={getLabelFromValue(param.key, param.value as string)}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete(param.key);
                  router.replace(`/search?${params.toString()}`);
                }}
              />
            ))}
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        {isLoading ? (
          <div className='py-8 text-center'>
            <p className='text-[14px] text-[#868c98]'>검색 중...</p>
          </div>
        ) : error ? (
          <div className='py-8 text-center'>
            <p className='text-[14px] text-[#868c98]'>
              검색 결과를 불러올 수 없습니다.
            </p>
          </div>
        ) : !results || results.length === 0 ? (
          <>
            <div className='flex flex-col items-center pt-20 pb-10'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center'>
                <Icon
                  icon='lucide:search'
                  className='h-12 w-12 text-[#c1c7d0]'
                />
              </div>
              <p className='mb-2 text-[18px] leading-[26px] font-bold tracking-[-0.18px] text-[#090a0c]'>
                '{searchQuery}' 검색 결과가 없습니다.
              </p>
              <p className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#868c98]'>
                검색어를 변경해 다시 시도해 보세요.
              </p>
            </div>

            <div className='border-t border-[#f1f2f4] pt-8'>
              <TrendingSearches onSearch={onSearch} />
            </div>
          </>
        ) : (
          results.map((festival, index) => (
            <div key={festival.id}>
              {/* <Link href={`/festival/${festival.id}`} className='block'>
              </Link> */}
              <FestivalListView
                id={festival.id || 0}
                image={festival.thumbnail || ''}
                theme={festival.theme || ''}
                title={festival.title || ''}
                loc={festival.address || ''}
                start_date={festival.startDate || ''}
                end_date={festival.endDate || ''}
                is_marked={false}
                map_x={festival.map_x || ''}
                map_y={festival.map_y || ''}
              />

              {index < results.length - 1 && (
                <div className='mt-5 h-px bg-[#f1f2f4]' />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
