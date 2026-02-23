import { useCallback, useRef } from 'react';

import { createFestivalMarker } from '@/components/map/NaverFestivalMarker';
import type { Festival } from '@/types/map';

export const useNaverMapMarkers = () => {
  const markersRef = useRef<naver.maps.Marker[]>([]);

  // 마커 생성 함수
  const createMarkers = useCallback(
    (
      festivals: Festival[],
      currentZoom: number,
      mapInstance: naver.maps.Map,
      onMarkerClick: (festival: Festival, isDetailed: boolean) => void,
    ) => {
      if (!mapInstance) return;

      // 기존 마커 제거
      clearMarkers();

      // 새 마커 생성
      festivals.forEach(festival => {
        const marker = createFestivalMarker(
          festival,
          currentZoom,
          onMarkerClick,
        );
        if (marker) {
          marker.setMap(mapInstance);
          markersRef.current.push(marker);
        }
      });
    },
    [],
  );

  // 마커 제거 함수
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  return {
    createMarkers,
    clearMarkers,
  };
};
