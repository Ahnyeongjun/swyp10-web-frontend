import { MARKER_SIZES, ZOOM_THRESHOLD } from '@/constants/mapConfig';
import themeList from '@/constants/themeList';
import type { Festival } from '@/types/map';

// 마커 아이콘 SVG 정의
const MARKER_ICONS = {
  unMarked: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.08598 2.43691C9.51298 1.40991 10.966 1.40991 11.394 2.43691L13.137 6.62691L17.661 6.98991C18.769 7.07891 19.219 8.46191 18.374 9.18491L14.927 12.1379L15.98 16.5529C16.238 17.6339 15.062 18.4889 14.113 17.9099L10.24 15.5439L6.36698 17.9099C5.41698 18.4899 4.24098 17.6339 4.49898 16.5529L5.55198 12.1379L2.10498 9.18491C1.26098 8.46191 1.70998 7.07891 2.81898 6.98991L7.34298 6.62691L9.08598 2.43691ZM10.24 3.56791L8.66898 7.34491C8.58057 7.55697 8.43542 7.74056 8.24948 7.87552C8.06354 8.01047 7.844 8.09157 7.61498 8.10991L3.53798 8.43691L6.64398 11.0979C6.99998 11.4029 7.15498 11.8819 7.04698 12.3379L6.09698 16.3159L9.58798 14.1839C9.78417 14.0641 10.0096 14.0007 10.2395 14.0007C10.4694 14.0007 10.6948 14.0641 10.891 14.1839L14.381 16.3159L13.433 12.3379C13.3795 12.1141 13.3889 11.88 13.46 11.6612C13.5311 11.4424 13.6612 11.2475 13.836 11.0979L16.942 8.43791L12.865 8.10991C12.6358 8.09175 12.416 8.01073 12.2299 7.87577C12.0438 7.7408 11.8985 7.55711 11.81 7.34491L10.24 3.56791Z" fill="#868C98"/>
    </svg>
  `,
  marked: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.394 2.43675C10.966 1.40975 9.51301 1.40975 9.08601 2.43675L7.34301 6.62675L2.81901 6.98975C1.71001 7.07875 1.26101 8.46175 2.10501 9.18475L5.55201 12.1378L4.49901 16.5528C4.24101 17.6338 5.41701 18.4898 6.36701 17.9098L10.24 15.5438L14.113 17.9098C15.062 18.4888 16.238 17.6338 15.98 16.5528L14.927 12.1378L18.374 9.18475C19.219 8.46175 18.769 7.07875 17.661 6.98975L13.137 6.62675L11.394 2.43675Z" fill="#FDBE00"/>
    </svg>
  `,
  rightChevron: `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.34998 12.0167L10.3167 8.33339L6.34998 4.65006" stroke="#868C98" stroke-width="1.13333" stroke-linecap="round"/>
    </svg>
  `,
} as const;

// 상세 마커 HTML 생성
const createDetailedMarkerHTML = (
  festival: Festival,
  theme: { bgColor: string; color: string; label: string },
): string => {
  const defaultImage = '/image/logo.png';
  const imageSrc = festival?.image || defaultImage;

  return `
    <a href="/festival/${festival.id}">
      <div class="box-border flex h-[64px] w-[224px] items-center gap-2 rounded-lg bg-white py-2 pr-3 pl-2" style="box-shadow: 0 0 5px 0 rgba(0,0,0,0.18);">
        <img src="${imageSrc}" onError="this.src='${defaultImage}'" alt="${festival?.title || ''}" width="48" height="48" class="aspect-square rounded-sm object-cover" />
        <div class="flex w-full flex-col justify-center gap-1">
          <div class="flex w-full items-center justify-between">
            <div class="flex h-[22px] w-[54px] items-center justify-center rounded-sm" style="background-color: ${theme.bgColor}; color: ${theme.color};">
              <p class="ui-text-sub-head-3">${theme?.label || ''}</p>
            </div>
            ${festival?.is_marked ? MARKER_ICONS.marked : MARKER_ICONS.unMarked}
          </div>
          <div class="flex items-center">
            <p class="line-clamp-1 ui-text-sub-head max-w-[135px]">${festival?.title || ''}</p>
            ${MARKER_ICONS.rightChevron}
          </div>
        </div>
      </div>
    </a>
  `;
};

// 간단한 마커 HTML 생성
const createSimpleMarkerHTML = (theme: {
  image: string;
  label: string;
}): string => {
  return `
    <div style="
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">
      <img src="${theme.image}" alt="${theme.label}" style="
        width: 100%;
        height: 100%;
        object-fit: cover;
      " />
    </div>
  `;
};

// 마커 스타일 생성
const createMarkerStyles = (): string => {
  return `
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  `;
};

export const createFestivalMarker = (
  festival: Festival,
  currentZoom: number,
  onClick: (festival: Festival, isDetailed: boolean) => void,
): naver.maps.Marker | null => {
  if (!window.naver?.maps) return null;

  // 테마 정보 찾기
  const theme = themeList.find(t => t.type === festival.theme) || themeList[5];

  // 마커 위치 설정
  const position = new window.naver.maps.LatLng(festival.map_y, festival.map_x);

  // 상세 마커 여부 결정
  const isDetailed = currentZoom >= ZOOM_THRESHOLD || festival.isDetailed;

  // 마커 요소 생성
  const markerElement = document.createElement('div');
  markerElement.className = 'festival-marker';
  markerElement.style.cssText = createMarkerStyles();

  // 마커 타입에 따른 HTML 설정
  if (isDetailed) {
    markerElement.innerHTML = createDetailedMarkerHTML(festival, theme);
  } else {
    markerElement.innerHTML = createSimpleMarkerHTML(theme);
  }

  // 마커 앵커 포인트 설정
  const anchorX = isDetailed
    ? MARKER_SIZES.detailed.anchorX
    : MARKER_SIZES.simple.anchorX;
  const anchorY = isDetailed
    ? MARKER_SIZES.detailed.anchorY
    : MARKER_SIZES.simple.anchorY;

  // 네이버 지도 마커 생성
  const marker = new window.naver.maps.Marker({
    position,
    icon: {
      content: markerElement,
      anchor: new window.naver.maps.Point(anchorX, anchorY),
    },
  });

  // 클릭 이벤트 리스너 추가
  window.naver.maps.Event.addListener(marker, 'click', () => {
    onClick(festival, isDetailed || false);
  });

  return marker;
};
