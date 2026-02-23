import { DEFAULT_LOCATION, GEOLOCATION_CONFIG } from '@/constants/mapConfig';
import type { LatLng, MapBounds } from '@/types/map';

// Geolocation 옵션 상수
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: GEOLOCATION_CONFIG.enableHighAccuracy,
  timeout: GEOLOCATION_CONFIG.timeout,
  maximumAge: GEOLOCATION_CONFIG.maximumAge,
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      console.log('Geolocation 지원하지 않음, 기본 위치 사용');
      if (GEOLOCATION_CONFIG.fallbackToDefault) {
        resolve(DEFAULT_LOCATION);
      } else {
        reject(new Error('Geolocation is not supported'));
      }
      return;
    }

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      resolve([latitude, longitude]);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = '위치 정보 가져오기 실패';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '위치 정보 접근 권한이 거부되었습니다';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = '위치 정보를 사용할 수 없습니다';
          break;
        case error.TIMEOUT:
          errorMessage = '위치 정보 요청 시간이 초과되었습니다';
          break;
        default:
          errorMessage = '알 수 없는 오류가 발생했습니다';
      }

      console.error(errorMessage, error);

      if (GEOLOCATION_CONFIG.fallbackToDefault) {
        resolve(DEFAULT_LOCATION);
      } else {
        reject(new Error(errorMessage));
      }
    };

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      GEOLOCATION_OPTIONS,
    );
  });
};

// 현재 위치 가져오기 (권한 확인 포함)
export const getCurrentLocationWithPermission = async (): Promise<
  [number, number]
> => {
  try {
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });

      if (permission.state === 'denied') {
        return DEFAULT_LOCATION;
      }
    }

    return await getCurrentLocation();
  } catch (error) {
    console.error('위치 정보 가져오기 실패:', error);
    return DEFAULT_LOCATION;
  }
};

// Leaflet bounds에서 MapBounds 생성
export const createMapBoundsFromLeaflet = (bounds: {
  getSouthWest: () => { lat: number; lng: number };
  getNorthEast: () => { lat: number; lng: number };
}): MapBounds => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  return {
    sw: { lat: sw.lat, lng: sw.lng },
    ne: { lat: ne.lat, lng: ne.lng },
    nw: { lat: ne.lat, lng: sw.lng },
    se: { lat: sw.lat, lng: ne.lng },
  };
};

// URL에서 좌표 파싱
export const parseLatLngFromURL = (
  lat: string | null,
  lng: string | null,
): LatLng | null => {
  if (!lat || !lng) return null;

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) return null;

  return { lat: latNum, lng: lngNum };
};

// URL용 좌표 포맷팅
export const formatLatLngForURL = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

// 디바운스 유틸리티
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 좌표 간 거리 계산 (미터 단위)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// 좌표가 경계 내에 있는지 확인
export const isCoordinateInBounds = (
  lat: number,
  lng: number,
  bounds: MapBounds,
): boolean => {
  return (
    lat >= bounds.sw.lat &&
    lat <= bounds.ne.lat &&
    lng >= bounds.sw.lng &&
    lng <= bounds.ne.lng
  );
};
