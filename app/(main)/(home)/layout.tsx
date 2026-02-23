export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 네이버 지도를 사용할 경우 아래 주석을 해제하세요
  // import Script from 'next/script';
  // import config from '@/config';
  // const clientId = config.naver.map_client_id;
  // <Script src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`} />

  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
