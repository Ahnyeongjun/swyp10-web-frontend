'use client';

import dynamic from 'next/dynamic';

import type { OpenStreetMapProps } from '@/types/map';

// OpenStreetMap (Leaflet) - 메인 지도
const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap'),
  { ssr: false },
);

// 네이버 지도 - 대체 지도 (필요 시 사용)
// import시: import NaverMapImpl from '@/components/map/NaverMapImpl';
// 또는: const NaverMapImpl = dynamic(() => import('@/components/map/NaverMapImpl'), { ssr: false });

export default function NaverMap(props: OpenStreetMapProps) {
  // 기본: OpenStreetMap 사용
  return <LeafletMap {...props} />;
}

export { getCurrentLocation } from '@/utils/mapUtils';
