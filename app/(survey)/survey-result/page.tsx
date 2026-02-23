'use client';

import { Suspense } from 'react';

import dynamic from 'next/dynamic';

// 로딩 상태를 표시하는 컴포넌트
function SurveyResultLoading() {
  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='px-5 pb-20'>
        <div className='py-8 text-center'>
          <p className='text-[14px] text-[#868c98]'>결과를 분석 중...</p>
        </div>
      </div>
    </div>
  );
}

// NOTE: SSR 비활성화
const SurveyResultClient = dynamic(
  () =>
    import('./_modules/SurveyResultClient').then(mod => mod.SurveyResultClient),
  {
    ssr: false,
  },
);

// 메인 페이지 컴포넌트
export default function SurveyResultPage() {
  return (
    <Suspense fallback={<SurveyResultLoading />}>
      <SurveyResultClient />
    </Suspense>
  );
}
