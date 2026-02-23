'use client';

import { useEffect, useRef, useState } from 'react';

import { Icon } from '@iconify/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getFestivalReviews } from '@/apis/SWYP10BackendAPI';
import { FestivalReviewResponse } from '@/apis/SWYP10BackendAPI.schemas';
import { Button } from '@/components/Button';
import { dialogClose, dialogOpen } from '@/components/Dialog';
import { useAuth } from '@/hooks/useAuth';
import { useInView } from '@/hooks/useInView';

interface ReviewsProps {
  id: string;
}

interface ReviewResponse {
  reviews: FestivalReviewResponse[];
  nextCursor: number | null;
  total: number;
}

const fetchReviews = async (
  festivalId: number,
  { pageParam = 0 }: { pageParam?: number },
): Promise<ReviewResponse> => {
  const response = await getFestivalReviews(festivalId, {
    page: pageParam,
    size: 10,
  });

  const reviews = response.data?.content || [];
  const total = response.data?.totalElements || 0;
  const totalPages = response.data?.totalPages || 0;
  const nextCursor = pageParam < totalPages - 1 ? pageParam + 1 : null;

  return {
    reviews,
    nextCursor,
    total,
  };
};

export default function Reviews({ id }: ReviewsProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [observe, unobserve] = useInView(setIsBottomVisible);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isReviewsLoading,
  } = useInfiniteQuery({
    queryKey: ['festival-reviews', id],
    queryFn: ({ pageParam }) => fetchReviews(Number(id), { pageParam }),
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextCursor,
  });

  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isBottomVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (loadMoreRef.current) {
      observe(loadMoreRef.current);
      return () => {
        if (loadMoreRef.current) {
          unobserve(loadMoreRef.current);
        }
      };
    }
  }, [observe, unobserve]);

  const allReviews = data?.pages.flatMap(page => page.reviews) || [];
  const totalReviews = data?.pages[0]?.total || 0;

  return (
    <div className='space-y-4'>
      {!isReviewsLoading && allReviews.length !== 0 && (
        <div className='flex items-center justify-between'>
          <h3 className='ui-text-body-2 text-gray-400'>
            총 {totalReviews}개의 리뷰
          </h3>
          <div className='flex items-center gap-1'>
            <Button
              variant='primary'
              size='sm'
              rounded='full'
              onClick={() => {
                if (isLoading) return;
                if (!isLoggedIn) {
                  dialogOpen({
                    title: '리뷰 작성을 원하시면 로그인이 필요합니다.',
                    type: 'confirm',
                    onApply: () => {
                      dialogClose();
                      router.push('/login');
                    },
                    applyText: '로그인하기',
                    closeText: '로그인없이 볼게요',
                  });
                } else router.push(`/festival/${id}/write-review`);
              }}
            >
              <Icon icon='ic:baseline-edit' fontSize={20} />
              <p className='ui-text-sub-head-3'>리뷰쓰기</p>
            </Button>
          </div>
        </div>
      )}

      <div className='space-y-4'>
        {isReviewsLoading ? (
          <div className='flex justify-center py-8'>
            <p className='ui-text-body text-gray-500'>리뷰를 불러오는 중...</p>
          </div>
        ) : allReviews.length === 0 ? (
          <div className='flex min-h-[200px] flex-col items-center justify-center gap-8'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <Image
                src={'/image/no-list/no-review-list.png'}
                width={68}
                height={68}
                alt='리뷰 없음'
              />
              <p className='ui-text-sub-head text-gray-700'>
                아직 작성된 축제 리뷰가 없습니다.
              </p>
            </div>
            <div className='flex flex-col items-center justify-center gap-3'>
              <p>지금 이 축제를 경험한 첫 리뷰어가 되어보세요.</p>
              <Button
                variant='primary'
                size='sm'
                rounded='full'
                onClick={() => {
                  if (isLoading) return;
                  if (!isLoggedIn) {
                    dialogOpen({
                      title: '리뷰 작성을 원하시면 로그인이 필요합니다.',
                      type: 'confirm',
                      onApply: () => {
                        dialogClose();
                        router.push('/login');
                      },
                      applyText: '로그인하기',
                      closeText: '로그인없이 볼게요',
                    });
                  } else router.push(`/festival/${id}/write-review`);
                }}
              >
                <Icon icon='ic:baseline-edit' fontSize={20} />
                <p>리뷰쓰기</p>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {[...(allReviews || [])].map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className='flex w-full flex-col gap-3 border-b border-gray-100 py-5'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src={review?.profileImage || ''}
                      alt='프로필'
                      className='aspect-square h-full w-full rounded-full object-cover'
                      width={20}
                      height={20}
                    />
                    <p className='w-full ui-text-sub-head-2 whitespace-nowrap text-gray-400'>
                      {review?.nickname || ''}
                    </p>
                  </div>
                  <p className='ui-text-caption text-gray-400'>
                    {review?.createdAt}
                  </p>
                </div>
                <p>{review?.content || ''}</p>
              </div>
            ))}

            {/* 무한스크롤 트리거 요소 */}
            <div ref={loadMoreRef} className='h-4' />

            {/* 다음 페이지 로딩 상태 */}
            {isFetchingNextPage && (
              <div className='flex justify-center py-4'>
                <p className='ui-text-body text-gray-500'>
                  더 많은 리뷰를 불러오는 중...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
