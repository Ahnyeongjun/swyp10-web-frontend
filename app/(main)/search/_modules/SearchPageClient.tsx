'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { searchFestivals } from '@/apis/SWYP10BackendAPI';
import {
  GetFestivalsForCalendarParams,
  GetFestivalsForCalendarRegion,
  GetFestivalsForCalendarTheme,
  SearchFestivalsTheme,
} from '@/apis/SWYP10BackendAPI.schemas';
import FilterModal, {
  FilterConfig,
  FilterModalRef,
  FilterValues,
} from '@/components/filter-modal';
import { QUERY_OPTIONS } from '@/constants/queryOptions';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { TrendingSearches } from './TrendingSearches';

// 필터 설정
const filterConfigs: FilterConfig[] = [
  {
    key: 'region',
    label: '지역',
    list: [
      { type: 'seoul', label: '서울' },
      { type: 'gyeonggi', label: '경기' },
      { type: 'gangwon', label: '강원' },
      { type: 'chungcheong', label: '충청' },
      { type: 'jeolla', label: '전라' },
      { type: 'gyeongsang', label: '경상' },
      { type: 'jeju', label: '제주' },
    ],
    showAllOption: true,
  },
  {
    key: 'companion',
    label: '누구랑',
    list: [
      { type: 'family', label: '가족' },
      { type: 'couple', label: '커플' },
      { type: 'parents', label: '부모님' },
      { type: 'pet', label: '반려견' },
      { type: 'friend', label: '친구' },
    ],
    showAllOption: true,
  },
  {
    key: 'theme',
    label: '테마',
    list: [
      { type: 'culture', label: '문화/예술' },
      { type: 'food', label: '음식/미식' },
      { type: 'music', label: '음악/공연' },
      { type: 'nature', label: '자연/체험' },
      { type: 'tradition', label: '전통/역사' },
    ],
    showAllOption: true,
  },
];

// 지역 코드 매핑 (실제 지역 코드에 맞게 조정 필요)
const regionCodeMap: Record<string, number> = {
  seoul: 1,
  gyeonggi: 31,
  gangwon: 32,
  chungcheong: 33,
  jeolla: 35,
  gyeongsang: 36,
  jeju: 39,
};

// 테마 매핑
const themeMap: Record<string, SearchFestivalsTheme> = {
  culture: SearchFestivalsTheme.CULTURE_ART,
  food: SearchFestivalsTheme.FOOD,
  music: SearchFestivalsTheme.MUSIC,
  nature: SearchFestivalsTheme.NATURE,
  tradition: SearchFestivalsTheme.TRADITION,
};

// 검색 기능을 담당하는 클라이언트 컴포넌트
export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const filterModalRef = useRef<FilterModalRef>(null);

  const queryParam = searchParams.get('q');

  // URL 파라미터에서 필터 값 초기화
  const [filterValues, setFilterValues] = useState<FilterValues>(() => {
    const initialValues: FilterValues = {};
    const region = searchParams.get('region');
    const companion = searchParams.get('companion');
    const theme = searchParams.get('theme');

    if (region) initialValues.region = region;
    if (companion) initialValues.companion = companion;
    if (theme) initialValues.theme = theme;

    return initialValues;
  });

  // 필터 값을 API 파라미터로 변환
  const getApiParams = () => {
    const baseParams: GetFestivalsForCalendarParams & {
      searchParam: string | null;
    } = {
      page: 0,
      size: 20,
      searchParam: queryParam,
    };

    // NOTE: Navigation 시 타입 안정성을 보장할 방법이 없어 임시로 강제 캐스팅 사용함 / 추후 Validation 도입
    // 지역 코드 변환
    if (filterValues.region && regionCodeMap[filterValues.region]) {
      baseParams.region = regionCodeMap[
        filterValues.region
      ] as unknown as GetFestivalsForCalendarRegion;
    }

    // 테마 변환
    if (filterValues.theme && themeMap[filterValues.theme]) {
      baseParams.theme = themeMap[
        filterValues.theme
      ] as unknown as GetFestivalsForCalendarTheme;
    }

    // companion은 API에서 지원하지 않으므로 무시

    return baseParams;
  };

  const searchRequest = getApiParams();

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useQuery({
    queryKey: ['searchFestivals', searchRequest],
    queryFn: () => searchFestivals(searchRequest),
    enabled: Boolean(queryParam?.trim()),
    staleTime: QUERY_OPTIONS.STALE_TIME,
    gcTime: QUERY_OPTIONS.GC_TIME,
  });

  useEffect(() => {
    if (queryParam) {
      setSearchValue(queryParam);
    } else {
      setSearchValue('');
    }
  }, [queryParam]);

  // URL 파라미터 변화에 따른 필터 값 업데이트
  useEffect(() => {
    const newFilterValues: FilterValues = {};
    const region = searchParams.get('region');
    const companion = searchParams.get('companion');
    const theme = searchParams.get('theme');

    if (region) newFilterValues.region = region;
    if (companion) newFilterValues.companion = companion;
    if (theme) newFilterValues.theme = theme;

    setFilterValues(newFilterValues);
  }, [searchParams]);

  const handleSearch = (keyword: string) => {
    setSearchValue(keyword);

    // 기존 URL 파라미터 유지하면서 검색어만 업데이트
    const params = new URLSearchParams(searchParams.toString());

    if (keyword.trim()) {
      params.set('q', keyword.trim());
    } else {
      params.delete('q');
    }

    const newUrl = `/search?${params.toString()}`;
    // NOTE: push를 하면 매번 RSC를 거쳐서 반응성이 떨어짐
    router.replace(newUrl);
  };

  const handleClear = () => {
    setSearchValue('');

    // 기존 필터 파라미터 유지하면서 검색어만 제거
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');

    const newUrl = `/search?${params.toString()}`;
    router.replace(newUrl);
  };

  const handleFilterApply = (values: FilterValues) => {
    setFilterValues(values);
    setShowFilters(false);

    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());

    // 기존 필터 파라미터 제거
    params.delete('region');
    params.delete('companion');
    params.delete('theme');

    // 새로운 필터 값 추가 (null이 아닌 경우만)
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    const newUrl = `/search?${params.toString()}`;
    router.replace(newUrl);
  };

  const handleFilterReset = () => {
    setFilterValues({});

    // URL에서 필터 파라미터 제거
    const params = new URLSearchParams(searchParams.toString());
    params.delete('region');
    params.delete('companion');
    params.delete('theme');

    const newUrl = `/search?${params.toString()}`;
    router.replace(newUrl);
  };

  const isSearching = Boolean(queryParam?.trim());
  const hasSearchResults =
    searchData?.data?.content && searchData.data.content.length > 0;

  // 디버깅용 로그
  console.log('Search Debug:', {
    queryParam,
    searchValue,
    isSearching,
    searchData,
    hasSearchResults,
  });

  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='sticky top-0 z-10 bg-white pt-6 pb-2.5'>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onClear={handleClear}
          onSearch={handleSearch}
        />
      </div>

      <div className='px-5 pb-20'>
        {isSearching ? (
          <SearchResults
            results={searchData?.data?.content || []}
            isLoading={isLoadingSearch}
            error={searchError}
            searchQuery={queryParam || ''}
            totalCount={searchData?.data?.totalElements}
            onSearch={handleSearch}
            filterValues={filterValues}
            onFilterClick={() => setShowFilters(true)}
          />
        ) : (
          <TrendingSearches onSearch={handleSearch} />
        )}
      </div>

      <FilterModal
        ref={filterModalRef}
        title='필터'
        configs={filterConfigs}
        initialValues={filterValues}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        open={showFilters}
        onOpenChange={setShowFilters}
      />
    </div>
  );
}
