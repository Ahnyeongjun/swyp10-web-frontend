'use client';

import { Suspense } from 'react';

import dynamic from 'next/dynamic';

// 로딩 상태를 표시하는 컴포넌트
function SurveyAnalyzingLoading() {
  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='flex items-center justify-center py-8'>
        <div className='text-sm text-gray-500'>로딩 중...</div>
      </div>
    </div>
  );
}

// NOTE: SSR 비활성화
const SurveyAnalyzingClient = dynamic(
  () =>
    import('./_modules/SurveyAnalyzingClient').then(
      mod => mod.SurveyAnalyzingClient,
    ),
  {
    ssr: false,
  },
);

// 분석중 페이지 컴포넌트
export default function SurveyAnalyzingPage() {
  return (
    <Suspense fallback={<SurveyAnalyzingLoading />}>
      <SurveyAnalyzingClient />
    </Suspense>
  );
}
