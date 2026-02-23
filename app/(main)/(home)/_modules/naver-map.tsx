'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DEFAULT_LOCATION,
  GEOLOCATION_CONFIG,
  MAP_CONFIG,
} from '@/constants/mapConfig';
import { useFestivalData } from '@/hooks/useFestivalData';
import { useMapEvents } from '@/hooks/useMapEvents';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useNaverMapScript } from '@/hooks/useNaverMapScript';
import type {
  Festival,
  MapBounds,
  MapQueryParams,
  NaverMapProps,
} from '@/types/map';
import { getCurrentLocationWithPermission } from '@/utils/mapUtils';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

export default function NaverMap({
  initialCenter,
  initialZoom,
  onSizeChange,
  onVisibilityChange,
  onMapReady,
  onZoomChange,
  onMarkerClick,
  className = '',
  style = {},
  focusFestivalId,
  queryParams,
  onMapInstanceReady,
  loadFestivalsInBounds: externalLoadFestivalsInBounds,
  festivals,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isInitializedRef = useRef(false);

  const [currentZoom, setCurrentZoom] = useState(MAP_CONFIG.defaultZoom);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);

  // 커스텀 훅들
  const {
    loadFestivalsInBounds: internalLoadFestivalsInBounds,
    updateFestivalFocus,
  } = useFestivalData(focusFestivalId);

  const memoFestivals = useMemo(() => festivals, [festivals]);

  const {
    getCenterFromURL,
    handleResize,
    handleIntersection,
    handleBoundsChange,
    handleZoomChange,
    handleCenterChange,
    cleanup,
  } = useMapEvents();

  const { createMarkers, clearMarkers } = useMapMarkers();
  const { loadScript } = useNaverMapScript();

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (festival: Festival, isDetailed: boolean) => {
      if (isDetailed) {
        console.log('상세 마커 클릭 - 축제 상세페이지로 이동:', festival);
      } else {
        console.log('작은 마커 클릭 - 상세 마커로 전환:', festival);
        updateFestivalFocus(festival.id);
      }

      onMarkerClick?.(festival, isDetailed);
    },
    [onMarkerClick, updateFestivalFocus],
  );

  // 마커 업데이트 함수
  const updateMarkers = useCallback(() => {
    console.log('updateMarkers::::::', memoFestivals);
    if (mapInstanceRef.current) {
      createMarkers(
        memoFestivals,
        currentZoom,
        mapInstanceRef.current,
        handleMarkerClick,
      );
    }
  }, [memoFestivals, currentZoom, createMarkers, handleMarkerClick]);

  // 축제 데이터 로드 함수
  const loadFestivalsInBoundsCallback = useCallback(
    async (bounds: MapBounds, params: MapQueryParams) => {
      if (mapInstanceRef.current) {
        if (externalLoadFestivalsInBounds) {
          await externalLoadFestivalsInBounds(bounds, params);
        } else {
          await internalLoadFestivalsInBounds(bounds, params);
        }
      }
    },
    [externalLoadFestivalsInBounds, internalLoadFestivalsInBounds],
  );

  // queryParams 변경 시 현재 bounds로 데이터 다시 로드
  useEffect(() => {
    if (mapInstanceRef.current && queryParams) {
      const bounds = mapInstanceRef.current.getBounds();
      if (bounds) {
        const boundsData = {
          sw: { lat: bounds.getMin().y, lng: bounds.getMin().x },
          ne: { lat: bounds.getMax().y, lng: bounds.getMax().x },
          nw: { lat: bounds.getMax().y, lng: bounds.getMin().x },
          se: { lat: bounds.getMin().y, lng: bounds.getMax().x },
        };
        loadFestivalsInBoundsCallback(boundsData, queryParams);
      }
    }
  }, [queryParams, loadFestivalsInBoundsCallback]);

  // 현재 위치 가져오기
  const getCurrentLocationForMap = useCallback(async () => {
    try {
      const location = await getCurrentLocationWithPermission();
      setCurrentLocation(location);
      console.log('현재 위치 설정됨:', location);
      return location;
    } catch (error) {
      console.error('현재 위치 가져오기 실패:', error);
      return null;
    }
  }, []);

  // 지도 초기화
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !window.naver?.maps) return;

    // 현재 위치 가져오기 시도
    let center = getCenterFromURL() || initialCenter;

    if (!center) {
      // URL이나 props에 중심 좌표가 없으면 현재 위치 시도
      const currentLoc = await getCurrentLocationForMap();
      if (currentLoc) {
        center = { lat: currentLoc[0], lng: currentLoc[1] };
        console.log('현재 위치로 지도 중심 설정:', center);
      } else {
        // 현재 위치도 실패하면 기본 위치 사용
        center = { lat: DEFAULT_LOCATION[0], lng: DEFAULT_LOCATION[1] };
        console.log('기본 위치로 지도 중심 설정:', center);
      }
    }

    const zoom =
      initialZoom ||
      (currentLocation
        ? GEOLOCATION_CONFIG.currentLocationZoom
        : MAP_CONFIG.defaultZoom);

    // 지도 인스턴스 생성
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      zoomControl: false,
      mapDataControl: false,
      scaleControl: false,
      logoControl: false,
      mapTypeControl: false,
      draggable: true,
      pinchZoom: true,
      scrollWheel: true,
      disableDoubleTapZoom: false,
      disableDoubleClickZoom: false,
    });

    mapInstanceRef.current = map;
    isInitializedRef.current = true;

    // 지도 인스턴스 준비 완료 콜백 호출
    onMapInstanceReady?.(map);

    // 이벤트 리스너 설정
    window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
      const bounds = map.getBounds();
      if (bounds) {
        // const boundsData = {
        //   sw: { lat: bounds.getMin().y, lng: bounds.getMin().x },
        //   ne: { lat: bounds.getMax().y, lng: bounds.getMax().x },
        //   nw: { lat: bounds.getMax().y, lng: bounds.getMin().x },
        //   se: { lat: bounds.getMin().y, lng: bounds.getMax().x },
        // };
        const searchParams = new URL(window.location.href).searchParams;
        const currentParams = {
          status: searchParams.get('status') || 'ALL',
          period: searchParams.get('period') || 'ALL',
          withWhom: searchParams.get('withWhom') || 'ALL',
          theme: searchParams.get('theme') || 'ALL',
          mapX: searchParams.get('mapX') || undefined,
          mapY: searchParams.get('mapY') || undefined,
          zoom: searchParams.get('zoom') || undefined,
          focusId: searchParams.get('focusId') || undefined,
          isNearBy: searchParams.get('isNearBy') || undefined,
        };
        handleBoundsChange(map, currentParams, loadFestivalsInBoundsCallback);
      }
    });

    window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
      const newZoom = map.getZoom();
      setCurrentZoom(newZoom);
      const searchParams = new URL(window.location.href).searchParams;
      const currentParams = {
        status: searchParams.get('status') || 'ALL',
        period: searchParams.get('period') || 'ALL',
        withWhom: searchParams.get('withWhom') || 'ALL',
        theme: searchParams.get('theme') || 'ALL',
        mapX: searchParams.get('mapX') || undefined,
        mapY: searchParams.get('mapY') || undefined,
        zoom: searchParams.get('zoom') || undefined,
        focusId: searchParams.get('focusId') || undefined,
        isNearBy: searchParams.get('isNearBy') || undefined,
      };
      handleZoomChange(map, currentParams, onZoomChange, updateMarkers);
    });

    window.naver.maps.Event.addListener(map, 'center_changed', () => {
      const searchParams = new URL(window.location.href).searchParams;
      const currentParams = {
        status: searchParams.get('status') || 'ALL',
        period: searchParams.get('period') || 'ALL',
        withWhom: searchParams.get('withWhom') || 'ALL',
        theme: searchParams.get('theme') || 'ALL',
        mapX: searchParams.get('mapX') || undefined,
        mapY: searchParams.get('mapY') || undefined,
        zoom: searchParams.get('zoom') || undefined,
        focusId: searchParams.get('focusId') || undefined,
        isNearBy: searchParams.get('isNearBy') || undefined,
      };
      handleCenterChange(map, currentParams);
    });

    // 초기 bounds로 축제 데이터 로드
    const initialBounds = map.getBounds();
    if (initialBounds) {
      const boundsData = {
        sw: { lat: initialBounds.getMin().y, lng: initialBounds.getMin().x },
        ne: { lat: initialBounds.getMax().y, lng: initialBounds.getMax().x },
        nw: { lat: initialBounds.getMax().y, lng: initialBounds.getMin().x },
        se: { lat: initialBounds.getMin().y, lng: initialBounds.getMax().x },
      };

      // 초기 로드 시에는 기본 쿼리 파라미터 사용
      const defaultParams = queryParams || {
        status: 'ALL',
        period: 'ALL',
        withWhom: 'ALL',
        theme: 'ALL',
      };

      loadFestivalsInBoundsCallback(boundsData, defaultParams);
    }

    // 줌 변경 디바운스 처리
    let zoomTimeout: NodeJS.Timeout;
    window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
      // 초기 로드 시에는 기본 쿼리 파라미터 사용
      const defaultParams = queryParams || {
        status: 'ALL',
        period: 'ALL',
        withWhom: 'ALL',
        theme: 'ALL',
      };
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        const newZoom = map.getZoom();
        onZoomChange?.(newZoom, defaultParams);
      }, MAP_CONFIG.refreshDelay);
    });

    onMapReady?.(map);
  }, [
    getCenterFromURL,
    initialCenter,
    initialZoom,
    onMapInstanceReady,
    onMapReady,
    queryParams,
    handleBoundsChange,
    handleZoomChange,
    handleCenterChange,
    loadFestivalsInBoundsCallback,
    onZoomChange,
    updateMarkers,
    currentLocation,
    getCurrentLocationForMap,
  ]);

  // 리사이즈 및 인터섹션 옵저버 설정
  useEffect(() => {
    if (!mapRef.current) return;

    const handleResizeCallback = (entries: ResizeObserverEntry[]) => {
      handleResize(entries, onSizeChange, mapInstanceRef.current);
    };

    const handleIntersectionCallback = (
      entries: IntersectionObserverEntry[],
    ) => {
      handleIntersection(entries, onVisibilityChange, mapInstanceRef.current);
    };

    resizeObserverRef.current = new ResizeObserver(handleResizeCallback);
    resizeObserverRef.current.observe(mapRef.current);

    intersectionObserverRef.current = new IntersectionObserver(
      handleIntersectionCallback,
      { threshold: 0.1 },
    );
    intersectionObserverRef.current.observe(mapRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [onSizeChange, onVisibilityChange, handleResize, handleIntersection]);

  // 스크립트 로딩 및 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isInitializedRef.current) {
      loadScript(initializeMap);
    }
  }, [loadScript, initializeMap]);

  // festivals 배열의 실제 내용 변경 감지
  const festivalsRef = useRef<Festival[]>([]);
  const prevFestivalsLengthRef = useRef(0);

  useEffect(() => {
    // festivals 배열의 길이나 내용이 실제로 변경되었는지 확인
    console.log('festivals::::::', festivals);
    // const hasChanged =
    //   festivals.length !== prevFestivalsLengthRef.current ||
    //   festivals.some(
    //     (festival, index) =>
    //       festivalsRef.current[index]?.id !== festival.id ||
    //       festivalsRef.current[index]?.isDetailed !== festival.isDetailed,
    //   );

    if (mapInstanceRef.current) {
      console.log('축제 데이터 변경됨, 마커 업데이트:', festivals.length);
      updateMarkers();
      festivalsRef.current = [...festivals];
      prevFestivalsLengthRef.current = festivals.length;
    }
  }, [festivals, updateMarkers, queryParams]);

  // 정리
  useEffect(() => {
    return () => {
      cleanup();
      clearMarkers();
      isInitializedRef.current = false;
    };
  }, [cleanup, clearMarkers]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: '87vh', ...style }}
    />
  );
}

// 기존 함수 export 유지 (하위 호환성)
export { getCurrentLocation } from '@/utils/mapUtils';
