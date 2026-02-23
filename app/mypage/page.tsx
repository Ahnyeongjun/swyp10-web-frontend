import { redirect } from 'next/navigation';

import {
  getCurrentUser,
  getMyPageFestivals,
  getMyReviews,
} from '@/apis/SWYP10BackendAPI';
import {
  FestivalSummaryResponse,
  MyReviewResponse,
} from '@/apis/SWYP10BackendAPI.schemas';
import BackArrowNav from '@/components/nav/nav';
import { Drawer } from '@/components/shadcn/drawer';
import config from '@/config';

import BookmarkList from './_modules/bookmark-list';
import MyPageClient from './_modules/my-page-client';
import MyPageFooter from './_modules/mypage-footer';
import Profile from './_modules/profile';
import ReviewList from './_modules/review-list';

interface SearchParamsType {
  tab?: string;
}

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const params = await searchParams;
  const initialTab =
    params.tab && ['bookmark', 'visited'].includes(params.tab)
      ? params.tab
      : 'bookmark';

  // 사용자 정보 가져오기
  let userInfo = null;
  try {
    const userInfoResponse = await getCurrentUser().then(r => r.data);
    userInfo = userInfoResponse;
  } catch (error) {
    console.error('사용자 정보를 가져오는데 실패했습니다:', error);
    await fetch(`${config.base_url}/api/auth/logout`, {
      method: 'DELETE',
    });
    redirect('/login');
  }

  let bookmarkList: FestivalSummaryResponse[] = [];
  if (initialTab === 'bookmark') {
    try {
      const bookmarkListResponse = await getMyPageFestivals({
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        bookmarked: true,
        // @ts-expect-error 기존 타입 오류
        offset: 0,
      }).then(r => r.data);
      console.log('bookmarkListResponse::::', bookmarkListResponse);
      bookmarkList = bookmarkListResponse?.content || [];
    } catch (error) {
      console.error('error::::', error);
    }
  }

  let reviewList: MyReviewResponse[] = [];
  if (initialTab === 'visited') {
    try {
      const reviewListResponse = await getMyReviews({
        page: 0,
        // @ts-expect-error 기존 타입 오류
        offset: 0,
        size: 10,
      }).then(r => r.data);
      console.log('reviewListResponse::::', reviewListResponse);
      reviewList = reviewListResponse?.content || [];
    } catch (error) {
      console.error('error:::', error);
    }
  }

  return (
    <div className='relative flex h-screen w-full flex-col'>
      <div className='fixedArea sticky top-0 flex w-full flex-col gap-2'>
        <BackArrowNav />
        <Profile userInfo={userInfo} />
        <MyPageClient initialTab={initialTab} />
      </div>

      <Drawer>
        <div className='flex-1 overflow-y-auto px-5'>
          {initialTab === 'bookmark' && (
            <BookmarkList initialBookmarkList={bookmarkList} />
          )}
          {initialTab === 'visited' && (
            <ReviewList initialReviewList={reviewList} />
          )}
        </div>

        <MyPageFooter />
      </Drawer>
    </div>
  );
}
