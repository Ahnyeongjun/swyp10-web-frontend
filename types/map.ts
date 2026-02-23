export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapBounds {
  sw: LatLng;
  ne: LatLng;
  nw: LatLng;
  se: LatLng;
}

export interface Festival {
  id: number;
  title: string;
  theme: string;
  image: string;
  loc: string;
  start_date: string;
  end_date: string;
  is_marked: boolean;
  map_x: number;
  map_y: number;
  isDetailed?: boolean;
}

export interface FestivalResponse {
  festivals: Festival[];
  total: number;
}

export interface MapQueryParams {
  status?: string;
  period?: string;
  withWhom?: string;
  theme?: string;
}

export interface NaverMapProps {
  initialCenter?: LatLng;
  initialZoom?: number;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onMapReady?: (map: naver.maps.Map) => void;
  onZoomChange?: (zoom: number, queryParams: MapQueryParams) => void;
  onMarkerClick?: (festival: Festival, isDetailed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  focusFestivalId?: number;
  queryParams?: MapQueryParams;
  onMapInstanceReady?: (mapInstance: naver.maps.Map) => void;
  loadFestivalsInBounds?: (
    bounds: MapBounds,
    queryParams?: MapQueryParams,
  ) => Promise<void>;
  festivals: Festival[];
}

export interface MapConfig {
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  boundsChangeDelay: number;
  centerChangeDelay: number;
  refreshDelay: number;
}
