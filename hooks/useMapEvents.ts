import { useCallback, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import type { MapQueryParams } from '@/types/map';

export const useMapEvents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const centerChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // URL에서 중심 좌표 가져오기
  const getCenterFromURL = useCallback(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) return null;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) return null;

    return { lat: latNum, lng: lngNum };
  }, [searchParams]);

  // URL에 중심 좌표 업데이트
  const updateURLWithCenter = useCallback(
    (lat: number, lng: number, queryParams: MapQueryParams) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lat', lat.toFixed(6));
      params.set('lng', lng.toFixed(6));

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router],
  );

  // 정리 함수
  const cleanup = useCallback(() => {
    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }
    if (centerChangeTimeoutRef.current) {
      clearTimeout(centerChangeTimeoutRef.current);
    }
  }, []);

  return {
    getCenterFromURL,
    updateURLWithCenter,
    cleanup,
  };
};
