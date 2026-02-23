'use client';

import { use, useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAddBookmark, useRemoveBookmark } from '@/apis/mutations/festival';
import { festivalDetail } from '@/apis/queries';

import FestivalHeader from './_modules/FestivalHeader';
import FestivalTabs from './_modules/FestivalTabs';
import MainImage from './_modules/MainImage';
import FestivalInfo from './_modules/tabs/FestivalInfo';
import RestaurantList from './_modules/tabs/RestaurantList';
import Reviews from './_modules/tabs/Reviews';
import TravelCourse from './_modules/tabs/TravelCourse';

interface FestivalDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const VALID_TABS = [
  'festival-info',
  'travel-course',
  'restaurants',
  'reviews',
] as const;

export type TabType = (typeof VALID_TABS)[number];

const DEFAULT_TAB: TabType = 'festival-info';

const isValidTab = (tab: string | null): tab is TabType => {
  return tab !== null && VALID_TABS.includes(tab as TabType);
};

export default function FestivalDetail({ params }: FestivalDetailProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const festivalId = useMemo(
    () => Number(resolvedParams.id),
    [resolvedParams.id],
  );

  const getInitialTab = (): TabType => {
    const tabFromUrl = searchParams.get('tab');

    return isValidTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;
  };

  const [selectedTab, setSelectedTab] = useState(getInitialTab);

  // URL의 searchParams 변경 감지
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    const validTab = isValidTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;
    setSelectedTab(validTab);
  }, [searchParams]);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('tab', tab);
    router.replace(`/festival/${resolvedParams.id}?${urlParams.toString()}`);
  };

  const { data } = useQuery(festivalDetail(festivalId));

  const detail = data?.data;
  const { mutateAsync: addBookmark } = useAddBookmark(festivalId);
  const { mutateAsync: removeBookmark } = useRemoveBookmark(festivalId);

  const festivalImages = useMemo(
    () =>
      (detail?.images ?? [])
        .map(img => img?.originimgurl)
        .filter((url): url is string => Boolean(url))
        .slice(0, 10),
    [detail?.images],
  );

  const mainImageSrc =
    detail?.thumbnail ??
    festivalImages[0] ??
    'https://picsum.photos/800/400?random=5';
  const mainImageAlt = detail?.title ?? 'festival main image';

  const formatDate = (date?: string | null) =>
    date ? date.replaceAll('-', '.') : '';

  const homepage = useMemo(
    () => detail?.info?.eventhomepage ?? detail?.content?.homepage ?? null,
    [detail?.info?.eventhomepage, detail?.content?.homepage],
  );

  return (
    // FIXME: 화면 크기 설정은 layout 수준에서 설정 필요, 모바일 뷰 재현을 위해 360px 사용
    <div className='relative min-h-screen w-screen max-w-[600px] bg-white'>
      {/* Main Content */}
      <div>
        <MainImage src={mainImageSrc} alt={mainImageAlt} />

        <FestivalHeader
          theme={detail?.theme ?? ''}
          title={detail?.title ?? ''}
          subtitle={detail?.content?.title ?? ''}
          startDate={formatDate(detail?.startDate)}
          endDate={formatDate(detail?.endDate)}
          location={detail?.address ?? ''}
          isBookmarked={detail?.bookmarked}
          onClickBookmark={detail?.bookmarked ? removeBookmark : addBookmark}
          onClickMap={() => {
            // 좌표는 상세 스키마에서 mapx/mapy가 string일 수 있음
            const mapX = detail?.mapx ? String(detail.mapx) : '';
            const mapY = detail?.mapy ? String(detail.mapy) : '';
            const params = new URLSearchParams();
            if (mapX && mapY) {
              params.set('mapX', mapX);
              params.set('mapY', mapY);
              params.set('zoom', '13'); // 상세 보기 적당 줌
            }
            if (detail?.id) params.set('focusId', String(detail.id));
            router.push(`/${params.toString() ? `?${params.toString()}` : ''}`);
          }}
        />

        <FestivalTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <div className='px-4 py-6'>
          {selectedTab === 'festival-info' && (
            <FestivalInfo
              festivalImages={festivalImages}
              overview={detail?.content?.overview}
              phone={detail?.info?.sponsor1tel}
              fee={detail?.info?.usetimefestival}
              homepage={homepage}
              eventPlace={detail?.info?.eventplace}
              discountInfo={detail?.info?.discountinfofestival}
              spendTime={detail?.info?.spendtimefestival}
            />
          )}
          {selectedTab === 'travel-course' && <TravelCourse params={params} />}
          {selectedTab === 'restaurants' && <RestaurantList params={params} />}
          {selectedTab === 'reviews' && <Reviews id={resolvedParams.id} />}
        </div>
      </div>
    </div>
  );
}
