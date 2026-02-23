'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';

import { Drawer, DrawerTrigger } from '@/components/shadcn/drawer';

import ReviewMenu from './review-drawer-menu';

interface ReviewItemProps {
  reviewId: number;
  image: string;
  title: string;
  date: string;
  content: string;
  onReviewDelete?: (reviewId: number) => void;
}

export default function ReviewItem({
  reviewId,
  image = 'https://picsum.photos/300/300',
  title,
  date,
  content,
  onReviewDelete,
}: ReviewItemProps) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
          <Image
            src={image || '/image/text-logo.png'}
            alt='review-item'
            width={40}
            height={40}
            className='aspect-square rounded-sm object-cover'
          />
          <div className='flex flex-col gap-1 py-1'>
            <p className='ui-text-sub-head-2'>{title}</p>
            <p className='ui-text-caption text-gray-400'>{date}</p>
          </div>
        </div>
        <Drawer>
          <DrawerTrigger>
            <Icon
              icon='ic:round-more-horiz'
              fontSize={20}
              className='cursor-pointer text-gray-300'
              onClick={() => {
                console.log('click');
              }}
            />
          </DrawerTrigger>
          <ReviewMenu reviewId={reviewId} onReviewDelete={onReviewDelete} />
        </Drawer>
      </div>
      <p className='ui-text-body-2 text-gray-700'>{content}</p>
    </div>
  );
}
