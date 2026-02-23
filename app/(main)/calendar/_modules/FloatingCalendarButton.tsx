'use client';

import { useState } from 'react';

import { Icon } from '@iconify/react';

import { Button } from '@/components/Button';

interface FloatingCalendarButtonProps {
  isVisible: boolean;
}

export default function FloatingCalendarButton({
  isVisible,
}: FloatingCalendarButtonProps) {
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // 스크롤 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform'>
      {/* <button
        onClick={scrollToTop}
        disabled={isScrolling}
        className={`flex items-center gap-2 rounded-full bg-black px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:bg-orange-600 ${isScrolling ? 'cursor-not-allowed opacity-70' : 'hover:scale-105 active:scale-95'} `}
      >
        <Icon
          icon='proicons:calendar'
          fontSize={20}
          className={isScrolling ? 'animate-bounce' : ''}
        />
        <span>달력 보기</span>
      </button> */}
      <Button
        onClick={scrollToTop}
        variant='primary'
        size='sm'
        rounded='full'
        className='px-3 py-2'
      >
        <Icon
          icon='proicons:calendar'
          fontSize={20}
          className={isScrolling ? 'animate-bounce' : ''}
        />
        달력보기
      </Button>
    </div>
  );
}
