import { useCallback, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { MAP_CONFIG } from '@/constants/mapConfig';
import type { MapBounds, MapQueryParams } from '@/types/map';

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

      // 기존 쿼리 파라미터들 유지
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

  // 리사이즈 이벤트 핸들러
  const handleResize = useCallback(
    (
      entries: ResizeObserverEntry[],
      onSizeChange?: (size: { width: number; height: number }) => void,
      mapInstance?: naver.maps.Map | null,
    ) => {
      entries.forEach(entry => {
        onSizeChange?.(entry.contentRect);

        if (mapInstance) {
          console.log('지도 크기 변화 감지:', entry.contentRect);
          mapInstance.refresh();
        }
      });
    },
    [],
  );

  // 인터섹션 이벤트 핸들러
  const handleIntersection = useCallback(
    (
      entries: IntersectionObserverEntry[],
      onVisibilityChange?: (isVisible: boolean) => void,
      mapInstance?: naver.maps.Map | null,
    ) => {
      entries.forEach(entry => {
        const isVisible = entry.isIntersecting;
        onVisibilityChange?.(isVisible);

        if (mapInstance) {
          if (isVisible) {
            console.log('지도가 화면에 나타남');
            setTimeout(() => {
              mapInstance?.refresh();
            }, MAP_CONFIG.refreshDelay);
          } else {
            console.log('지도가 화면에서 사라짐');
          }
        }
      });
    },
    [],
  );

  // 경계 변화 이벤트 핸들러
  const handleBoundsChange = useCallback(
    (
      mapInstance: naver.maps.Map,
      queryParams: MapQueryParams,
      onLoadFestivals?: (
        bounds: MapBounds,
        queryParams: MapQueryParams,
      ) => void,
    ) => {
      if (!mapInstance) return;

      const bounds = mapInstance.getBounds();
      if (!bounds) return;

      const boundsData = {
        sw: { lat: bounds.getMin().y, lng: bounds.getMin().x },
        ne: { lat: bounds.getMax().y, lng: bounds.getMax().x },
        nw: { lat: bounds.getMax().y, lng: bounds.getMin().x },
        se: { lat: bounds.getMin().y, lng: bounds.getMax().x },
      };

      // 이전 타이머가 있다면 취소
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }

      // MAP_CONFIG.boundsChangeDelay 후에 축제 데이터 로드
      boundsChangeTimeoutRef.current = setTimeout(() => {
        console.log('지도 경계 변화:', boundsData);
        onLoadFestivals?.(boundsData, queryParams);
      }, MAP_CONFIG.boundsChangeDelay);
    },
    [],
  );

  // 줌 변화 이벤트 핸들러
  const handleZoomChange = useCallback(
    (
      mapInstance: naver.maps.Map,
      queryParams: MapQueryParams,
      onZoomChange?: (zoom: number, queryParams: MapQueryParams) => void,
      onUpdateMarkers?: () => void,
    ) => {
      if (!mapInstance) return;

      const zoom = mapInstance.getZoom();
      console.log('줌 레벨 변화:', zoom);

      onZoomChange?.(zoom, queryParams);
      onUpdateMarkers?.();
    },
    [],
  );

  // 중심 변화 이벤트 핸들러
  const handleCenterChange = useCallback(
    (mapInstance: naver.maps.Map, queryParams: MapQueryParams) => {
      if (!mapInstance) return;

      const center = mapInstance.getCenter();
      if (!center) return;

      // 이전 타이머가 있다면 취소
      if (centerChangeTimeoutRef.current) {
        clearTimeout(centerChangeTimeoutRef.current);
      }

      // MAP_CONFIG.centerChangeDelay 후에 URL 업데이트
      centerChangeTimeoutRef.current = setTimeout(() => {
        updateURLWithCenter(center.y, center.x, queryParams);
      }, MAP_CONFIG.centerChangeDelay);
    },
    [updateURLWithCenter],
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
    handleResize,
    handleIntersection,
    handleBoundsChange,
    handleZoomChange,
    handleCenterChange,
    cleanup,
  };
};
