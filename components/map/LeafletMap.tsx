'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  DEFAULT_LOCATION,
  GEOLOCATION_CONFIG,
  MAP_CONFIG,
  MARKER_SIZES,
} from '@/constants/mapConfig';
import { useFestivalData } from '@/hooks/useFestivalData';
import { useMapEvents } from '@/hooks/useMapEvents';
import type {
  Festival,
  MapBounds,
  MapQueryParams,
  OpenStreetMapProps,
} from '@/types/map';
import {
  createMapBoundsFromLeaflet,
  getCurrentLocationWithPermission,
} from '@/utils/mapUtils';

import { getFestivalMarkerHTML, isDetailedMarker } from './FestivalMarker';

export default function LeafletMap({
  initialCenter,
  initialZoom,
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
}: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const isInitializedRef = useRef(false);
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const centerChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentZoom, setCurrentZoom] = useState(
    initialZoom || MAP_CONFIG.defaultZoom,
  );

  const {
    loadFestivalsInBounds: internalLoadFestivalsInBounds,
    updateFestivalFocus,
  } = useFestivalData(focusFestivalId);

  const { getCenterFromURL, updateURLWithCenter } = useMapEvents();

  const memoFestivals = useMemo(() => festivals, [festivals]);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (festival: Festival, isDetailed: boolean) => {
      if (!isDetailed) {
        updateFestivalFocus(festival.id);
      }
      onMarkerClick?.(festival, isDetailed);
    },
    [onMarkerClick, updateFestivalFocus],
  );

  // bounds에서 MapBounds 추출
  const getMapBounds = useCallback((map: L.Map): MapBounds => {
    return createMapBoundsFromLeaflet(map.getBounds());
  }, []);

  // 축제 데이터 로드 함수
  const loadFestivalsInBoundsCallback = useCallback(
    async (bounds: MapBounds, params: MapQueryParams) => {
      if (externalLoadFestivalsInBounds) {
        await externalLoadFestivalsInBounds(bounds, params);
      } else {
        await internalLoadFestivalsInBounds(bounds, params);
      }
    },
    [externalLoadFestivalsInBounds, internalLoadFestivalsInBounds],
  );

  // URL에서 현재 쿼리 파라미터 가져오기
  const getCurrentParams = useCallback((): MapQueryParams => {
    const searchParams = new URL(window.location.href).searchParams;
    return {
      status: searchParams.get('status') || 'ALL',
      period: searchParams.get('period') || 'ALL',
      withWhom: searchParams.get('withWhom') || 'ALL',
      theme: searchParams.get('theme') || 'ALL',
    };
  }, []);

  // 마커 업데이트
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const zoom = mapInstanceRef.current.getZoom();

    memoFestivals.forEach(festival => {
      const isDetailed = isDetailedMarker(festival, zoom);
      const html = getFestivalMarkerHTML(festival, zoom);

      const iconSize: [number, number] = isDetailed
        ? [MARKER_SIZES.detailed.width, MARKER_SIZES.detailed.height]
        : [MARKER_SIZES.simple.width, MARKER_SIZES.simple.height];

      const iconAnchor: [number, number] = isDetailed
        ? [MARKER_SIZES.detailed.anchorX, MARKER_SIZES.detailed.anchorY]
        : [MARKER_SIZES.simple.anchorX, MARKER_SIZES.simple.anchorY];

      const icon = L.divIcon({
        html,
        className: 'festival-marker-icon',
        iconSize,
        iconAnchor,
      });

      const marker = L.marker([festival.map_y, festival.map_x], { icon });
      marker.on('click', () => {
        handleMarkerClick(festival, isDetailed);
      });
      markersLayerRef.current!.addLayer(marker);
    });
  }, [memoFestivals, handleMarkerClick]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || isInitializedRef.current) return;

    const init = async () => {
      let center = getCenterFromURL() || initialCenter;

      if (!center) {
        try {
          const currentLoc = await getCurrentLocationWithPermission();
          if (currentLoc) {
            center = { lat: currentLoc[0], lng: currentLoc[1] };
          }
        } catch {
          // fallback
        }
      }

      if (!center) {
        center = { lat: DEFAULT_LOCATION[0], lng: DEFAULT_LOCATION[1] };
      }

      const zoom =
        initialZoom ||
        (center.lat !== DEFAULT_LOCATION[0]
          ? GEOLOCATION_CONFIG.currentLocationZoom
          : MAP_CONFIG.defaultZoom);

      const map = L.map(mapRef.current!, {
        center: [center.lat, center.lng],
        zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: false,
        attributionControl: true,
      });

      // OpenStreetMap 타일 레이어
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: MAP_CONFIG.maxZoom,
      }).addTo(map);

      // 마커 레이어 그룹
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapInstanceRef.current = map;
      isInitializedRef.current = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMapInstanceReady?.(map as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMapReady?.(map as any);

      // 이벤트: moveend (bounds + center 변경)
      map.on('moveend', () => {
        if (boundsChangeTimeoutRef.current)
          clearTimeout(boundsChangeTimeoutRef.current);

        boundsChangeTimeoutRef.current = setTimeout(() => {
          const bounds = getMapBounds(map);
          const params = getCurrentParams();
          loadFestivalsInBoundsCallback(bounds, params);
        }, MAP_CONFIG.boundsChangeDelay);

        if (centerChangeTimeoutRef.current)
          clearTimeout(centerChangeTimeoutRef.current);

        centerChangeTimeoutRef.current = setTimeout(() => {
          const c = map.getCenter();
          const params = getCurrentParams();
          updateURLWithCenter(c.lat, c.lng, params);
        }, MAP_CONFIG.centerChangeDelay);
      });

      // 이벤트: zoomend
      map.on('zoomend', () => {
        const newZoom = map.getZoom();
        setCurrentZoom(newZoom);
        const params = getCurrentParams();
        onZoomChange?.(newZoom, params);
      });

      // 초기 로드
      const initialBounds = getMapBounds(map);
      const defaultParams = queryParams || {
        status: 'ALL',
        period: 'ALL',
        withWhom: 'ALL',
        theme: 'ALL',
      };
      loadFestivalsInBoundsCallback(initialBounds, defaultParams);
    };

    init();

    return () => {
      if (boundsChangeTimeoutRef.current)
        clearTimeout(boundsChangeTimeoutRef.current);
      if (centerChangeTimeoutRef.current)
        clearTimeout(centerChangeTimeoutRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
    // 초기화는 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // queryParams 변경 시 현재 bounds로 데이터 다시 로드
  useEffect(() => {
    if (mapInstanceRef.current && queryParams && isInitializedRef.current) {
      const bounds = getMapBounds(mapInstanceRef.current);
      loadFestivalsInBoundsCallback(bounds, queryParams);
    }
  }, [queryParams, loadFestivalsInBoundsCallback, getMapBounds]);

  // festivals 변경 시 마커 업데이트
  useEffect(() => {
    if (isInitializedRef.current) {
      updateMarkers();
    }
  }, [memoFestivals, currentZoom, updateMarkers]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: '87vh', ...style }}
    />
  );
}

// 하위 호환성
export { getCurrentLocation } from '@/utils/mapUtils';
