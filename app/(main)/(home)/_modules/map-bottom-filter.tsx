'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';
import BottomSheet, { BottomSheetRef } from '@/components/bottom-sheet';
import FilterSection from '@/components/filter-section';
import { periodList } from '@/constants/periodList';
import { statusList } from '@/constants/statusList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';

interface MapBottomFilterProps {
  initialParams: {
    period?: string;
    status?: string;
    withWhom?: string;
    theme?: string;
  };
}

// 필터 타입 정의
type FilterType = 'period' | 'status' | 'withWhom' | 'theme';

// 필터 설정 정의
const FILTER_CONFIG = {
  period: { label: '기간', list: periodList },
  status: { label: '축제 진행 여부', list: statusList },
  withWhom: { label: '누구랑', list: withWhomList },
  theme: { label: '테마', list: themeList },
} as const;

export default function MapBottomFilter({
  initialParams,
}: MapBottomFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  // 필터 상태 관리
  const [filters, setFilters] = useState<Record<FilterType, string | null>>({
    period: initialParams?.period || null,
    status: initialParams?.status || null,
    withWhom: initialParams?.withWhom || null,
    theme: initialParams?.theme || null,
  });

  // URL 파라미터 변경 시 필터 상태 동기화
  useEffect(() => {
    const newFilters: Record<FilterType, string | null> = {
      period: searchParams.get('period'),
      status: searchParams.get('status'),
      withWhom: searchParams.get('withWhom'),
      theme: searchParams.get('theme'),
    };

    setFilters(newFilters);
  }, [searchParams]);

  // 필터 값 변경 핸들러
  const handleFilterChange = useCallback(
    (filterType: FilterType, value: string | null) => {
      setFilters(prev => ({
        ...prev,
        [filterType]: value,
      }));
    },
    [],
  );

  // 필터 초기화 핸들러
  const handleReset = useCallback(() => {
    // 상태 초기화
    setFilters({
      period: null,
      status: null,
      withWhom: null,
      theme: null,
    });

    // 쿼리 파라미터에서 필터 관련 파라미터 제거
    const params = new URLSearchParams(searchParams);
    Object.keys(filters).forEach(key => {
      params.delete(key);
    });

    // URL 업데이트
    router.replace(`?${params.toString()}`);

    // 바텀시트 닫기
    bottomSheetRef.current?.close();
  }, [searchParams, router, filters]);

  // 필터 적용 핸들러
  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // 필터 값들을 쿼리 파라미터로 업데이트
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // URL 업데이트
    router.replace(`?${params.toString()}`);

    // 바텀시트 닫기
    bottomSheetRef.current?.close();
  }, [searchParams, router, filters]);

  // 필터 섹션 렌더링
  const filterSections = useMemo(() => {
    return Object.entries(FILTER_CONFIG).map(([key, config]) => (
      <FilterSection
        key={key}
        label={config.label}
        list={config.list}
        value={filters[key as FilterType]}
        setValue={(value: React.SetStateAction<string | null>) => {
          if (typeof value === 'function') {
            const newValue = value(filters[key as FilterType]);
            handleFilterChange(key as FilterType, newValue);
          } else {
            handleFilterChange(key as FilterType, value);
          }
        }}
      />
    ));
  }, [filters, handleFilterChange]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      title={'필터'}
      footerChildren={
        <div className='flex items-center gap-2'>
          <Button onClick={handleReset} size='lg' variant='secondary'>
            초기화
          </Button>
          <Button onClick={handleApply} size='lg' variant='primary'>
            적용하기
          </Button>
        </div>
      }
    >
      <div className='flex flex-col items-center justify-center px-4'>
        <div className='my-4 flex w-full max-w-[600px] flex-col justify-center gap-5'>
          {filterSections}
        </div>
      </div>
    </BottomSheet>
  );
}
