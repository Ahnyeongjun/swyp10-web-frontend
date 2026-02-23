'use client';

import { useRef } from 'react';

import { Icon } from '@iconify/react';

import { deleteMyReview } from '@/apis/SWYP10BackendAPI';
import { Button } from '@/components/Button';
import { showCustomToast } from '@/components/CustomToast';
import { dialogClose, dialogOpen } from '@/components/Dialog';
import BottomSheet, { BottomSheetRef } from '@/components/bottom-sheet';

interface ReviewMenuProps {
  reviewId: number;
  onReviewDelete?: (reviewId: number) => void;
}

export default function ReviewMenu({
  reviewId,
  onReviewDelete,
}: ReviewMenuProps) {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handleDelete = async () => {
    dialogOpen({
      title: '리뷰를 삭제하시겠어요?',
      id: 'review-delete-dialog',
      variant: 'destructive',
      type: 'confirm',
      onApply: async () => {
        try {
          await deleteMyReview(reviewId);

          showCustomToast({
            message: '리뷰가 삭제되었습니다.',
            type: 'success',
          });

          // 리뷰 삭제 콜백 호출
          if (onReviewDelete) {
            onReviewDelete(reviewId);
          }

          bottomSheetRef.current?.close();
        } catch (error) {
          console.error('리뷰 삭제 실패:', error);
          showCustomToast({
            message: '리뷰 삭제에 실패했습니다.',
            type: 'error',
          });
        } finally {
          dialogClose('review-delete-dialog');
        }
      },
    });
  };

  return (
    <BottomSheet removeIndicator titleChildren={<></>} ref={bottomSheetRef}>
      <div className='px-5 pb-4'>
        <Button variant='ghost' onClick={handleDelete}>
          <div className='flex items-center gap-2'>
            <Icon icon='proicons:delete' className='text-red' fontSize={20} />
            <p className='ui-text-sub-head-2 text-red'>축제 리뷰 삭제</p>
          </div>
        </Button>
      </div>
    </BottomSheet>
  );
}
