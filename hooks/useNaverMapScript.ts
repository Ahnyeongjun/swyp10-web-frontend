import { useCallback, useRef } from 'react';

import config from '@/config';

export const useNaverMapScript = () => {
  const scriptLoadedRef = useRef(false);
  const clientId = config.naver.map_client_id;

  // 스크립트 로드 함수
  const loadScript = useCallback(
    (onLoad: () => void) => {
      // 이미 로드된 경우
      if (window.naver && window.naver.maps) {
        scriptLoadedRef.current = true;
        onLoad();
        return;
      }

      // 이미 로드 중인 경우
      if (scriptLoadedRef.current) {
        onLoad();
        return;
      }

      // 새 스크립트 생성 및 로드
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
      script.async = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        onLoad();
      };

      script.onerror = () => {
        console.error('네이버 지도 스크립트 로드 실패');
        scriptLoadedRef.current = false;
      };

      document.head.appendChild(script);
    },
    [clientId],
  );

  // 스크립트 로드 상태 확인
  const isScriptLoaded = useCallback(() => {
    return scriptLoadedRef.current && !!(window.naver && window.naver.maps);
  }, []);

  return {
    loadScript,
    isScriptLoaded,
  };
};
