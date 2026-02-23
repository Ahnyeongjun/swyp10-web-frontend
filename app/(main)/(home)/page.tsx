import MapPageClient from './_modules/map-page-client';

interface SearchParamsType {
  // selected: string;
  isNearBy: string;
  status: string;
  period: string;
  withWhom: string;
  theme: string;
  mapX?: string;
  mapY?: string;
  focusId?: string;
  zoom?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const { status, period, withWhom, theme, isNearBy } = await searchParams;

  return (
    <MapPageClient
      initialParams={{
        status,
        period,
        withWhom,
        theme,
        isNearBy,
        mapX: (await searchParams).mapX,
        mapY: (await searchParams).mapY,
        focusId: (await searchParams).focusId,
        zoom: (await searchParams).zoom,
      }}
    />
  );
}
