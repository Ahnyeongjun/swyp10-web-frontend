import type { MapConfig } from '@/types/map';

// 지도 기본 설정
export const MAP_CONFIG: MapConfig = {
  minZoom: 6,
  maxZoom: 17,
  defaultZoom: 12,
  boundsChangeDelay: 700,
  centerChangeDelay: 500,
  refreshDelay: 100,
};

// 기본 위치 (서울 시청)
export const DEFAULT_LOCATION: [number, number] = [37.3595704, 127.105399];

// 현재 위치 관련 설정
export const GEOLOCATION_CONFIG = {
  // 위치 정보 요청 타임아웃 (ms)
  timeout: 10000,
  // 고정밀 위치 정보 사용
  enableHighAccuracy: true,
  // 위치 정보 캐시 시간 (ms) - 0은 캐시하지 않음
  maximumAge: 0,
  // 현재 위치 가져오기 실패 시 기본 위치 사용
  fallbackToDefault: true,
  // 현재 위치 가져오기 성공 시 줌 레벨
  currentLocationZoom: 15,
} as const;

// 마커 크기 설정
export const MARKER_SIZES = {
  detailed: {
    width: 224,
    height: 64,
    anchorX: 60,
    anchorY: 30,
  },
  simple: {
    width: 36,
    height: 36,
    anchorX: 12,
    anchorY: 12,
  },
} as const;

// 상세 마커 표시를 위한 줌 레벨 임계값
export const ZOOM_THRESHOLD = 14;

// 지도 성능 최적화 설정
export const MAP_PERFORMANCE = {
  // 마커 클러스터링 활성화 줌 레벨
  clusteringZoomThreshold: 10,
  // 한 번에 로드할 최대 축제 수
  maxFestivalsPerLoad: 100,
  // 지도 업데이트 최소 간격 (ms)
  minUpdateInterval: 100,
  // 마커 애니메이션 지속 시간 (ms)
  markerAnimationDuration: 300,
} as const;

// 지도 스타일 설정
export const MAP_STYLES = {
  // 기본 지도 스타일
  defaultStyle: 'normal',
  // 야간 모드 스타일
  nightStyle: 'night',
  // 위성 지도 스타일
  satelliteStyle: 'satellite',
} as const;

// 에러 처리 설정
export const ERROR_CONFIG = {
  // 위치 정보 요청 타임아웃 (ms)
  geolocationTimeout: 10000,
  // API 요청 재시도 횟수
  maxRetryCount: 3,
  // 재시도 간격 (ms)
  retryInterval: 1000,
} as const;
