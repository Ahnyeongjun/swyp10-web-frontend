'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import searchImage from '@/assets/images/festival-recommendation/search.png';

export function SurveyAnalyzingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      // URL 파라미터를 그대로 전달하면서 결과 페이지로 이동
      const currentParams = searchParams.toString();
      const resultUrl = currentParams
        ? `/survey-result?${currentParams}`
        : '/survey-result';
      router.push(resultUrl);
    }, 1500); // 1.5초

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className='flex h-full w-full flex-1 flex-col items-center justify-center'>
      <div className='flex w-full max-w-[272px] flex-col items-center gap-12'>
        {/* 분석중 텍스트 */}
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='ui-text-head'>나의 축제 유형 분석 중...</h1>
          </div>

          {/* 분석중 이미지 */}
          <div className='flex items-center justify-center'>
            <Image
              src={searchImage}
              alt='분석 중'
              className='h-full w-full object-cover'
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
