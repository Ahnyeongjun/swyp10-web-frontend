'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { getFestivalsForMap } from '@/apis/SWYP10BackendAPI';
import type {
  FestivalMapRequestPeriod,
  FestivalMapRequestStatus,
  FestivalMapRequestTheme,
  FestivalMapRequestWithWhom,
  FestivalSummaryResponse,
} from '@/apis/SWYP10BackendAPI.schemas';
import type {
  Festival,
  FestivalResponse,
  MapBounds,
  MapQueryParams,
} from '@/types/map';

// 축제 데이터 변환 함수
const transformFestivalData = (
  festival: FestivalSummaryResponse,
): Festival => ({
  id: festival.id || 0,
  title: festival.title || '',
  theme: festival.theme || '',
  image: festival.thumbnail || '',
  loc: festival.address || '',
  start_date: festival.startDate || '',
  end_date: festival.endDate || '',
  is_marked: festival.bookmarked || false,
  map_x: Number(festival.map_x || 0),
  map_y: Number(festival.map_y || 0),
});

// 경계 내 축제 데이터 가져오기
const fetchFestivalsInBounds = async (
  bounds: MapBounds,
  queryParams?: MapQueryParams,
): Promise<FestivalResponse> => {
  try {
    const response = await getFestivalsForMap({
      page: 0,
      size: 100,
      sort: 'createdAt,desc',
      status: (queryParams?.status as FestivalMapRequestStatus) || 'ALL',
      period: (queryParams?.period as FestivalMapRequestPeriod) || 'ALL',
      withWhom: (queryParams?.withWhom as FestivalMapRequestWithWhom) || 'ALL',
      theme: (queryParams?.theme as FestivalMapRequestTheme) || 'ALL',
      latTopLeft: bounds.nw.lat,
      lngTopLeft: bounds.nw.lng,
      latBottomRight: bounds.se.lat,
      lngBottomRight: bounds.se.lng,
    });

    const content = response?.data.content || [];
    const festivals: Festival[] = content.map(transformFestivalData);

    return {
      festivals,
      total: response?.data?.totalElements || 0,
    };
  } catch (error) {
    console.error('축제 데이터 로드 실패:', error);
    return {
      festivals: [],
      total: 0,
    };
  }
};

export const useFestivalData = (focusFestivalId?: number) => {
  const router = useRouter();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);

  const isLoadingRef = useRef(false);
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const lastQueryParamsRef = useRef<MapQueryParams | undefined>(null);

  // 메모이제이션된 축제 데이터
  const memoFestivals = useMemo(() => festivals, [festivals]);

  // 경계 내 축제 데이터 로드
  const loadFestivalsInBounds = useCallback(
    async (bounds: MapBounds, queryParams?: MapQueryParams) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoadingFestivals(true);

      try {
        const response = await fetchFestivalsInBounds(bounds, queryParams);

        const festivalsWithFocus =
          typeof focusFestivalId === 'number'
            ? response.festivals.map(f => ({
                ...f,
                isDetailed: f.id === focusFestivalId,
              }))
            : response.festivals;

        setFestivals(festivalsWithFocus);
        console.log('축제 데이터 로드:', response.festivals.length);

        // 마지막으로 로드한 bounds와 queryParams 저장
        lastBoundsRef.current = bounds;
        lastQueryParamsRef.current = queryParams;
      } catch (error) {
        console.error('축제 데이터 로드 실패:', error);
      } finally {
        setIsLoadingFestivals(false);
        isLoadingRef.current = false;
      }
    },
    [focusFestivalId],
  );

  // 현재 쿼리 파라미터로 데이터 다시 로드
  const reloadWithCurrentQueryParams = useCallback(() => {
    if (lastBoundsRef.current && lastQueryParamsRef.current) {
      loadFestivalsInBounds(lastBoundsRef.current, lastQueryParamsRef.current);
    }
  }, [loadFestivalsInBounds]);

  // 축제 포커스 업데이트
  const updateFestivalFocus = useCallback((festivalId: number) => {
    const searchParams = new URL(window.location.href).searchParams;
    const params = new URLSearchParams(searchParams.toString());
    params.set('focusId', festivalId.toString());
    router.replace(`?${params.toString()}`);
  }, []);

  // 북마크 상태 업데이트
  const updateBookmarkStatus = useCallback(
    (festivalId: number, isBookmarked: boolean) => {
      setFestivals(prevFestivals =>
        prevFestivals.map(f => ({
          ...f,
          is_marked: f.id === festivalId ? isBookmarked : f.is_marked,
        })),
      );
    },
    [],
  );

  // 쿼리 파라미터만 변경하여 데이터 다시 로드 (지도 경계는 유지)
  const reloadWithNewQueryParams = useCallback(
    async (newQueryParams: MapQueryParams) => {
      if (lastBoundsRef.current) {
        await loadFestivalsInBounds(lastBoundsRef.current, newQueryParams);
      }
    },
    [loadFestivalsInBounds],
  );

  return {
    festivals: memoFestivals,
    isLoadingFestivals,
    loadFestivalsInBounds,
    reloadWithCurrentQueryParams,
    reloadWithNewQueryParams,
    updateFestivalFocus,
    updateBookmarkStatus,
  };
};
