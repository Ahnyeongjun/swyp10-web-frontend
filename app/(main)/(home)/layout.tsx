import Script from 'next/script';

import config from '@/config';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = config.naver.map_client_id;

  return (
    <div>
      <Script
        type='text/javascript'
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
      ></Script>
      <div>{children}</div>
    </div>
  );
}
