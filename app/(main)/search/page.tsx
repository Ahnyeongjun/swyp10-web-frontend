'use client';

import { Suspense } from 'react';

import dynamic from 'next/dynamic';

// 로딩 상태를 표시하는 컴포넌트
function SearchPageLoading() {
  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='sticky top-0 z-10 bg-white pt-6 pb-2.5'>
        <div className='px-5'>
          <div className='h-10 animate-pulse rounded-lg bg-gray-200' />
        </div>
      </div>
      <div className='px-5 pb-20'>
        <div className='py-8 text-center'>
          <p className='text-[14px] text-[#868c98]'>로딩 중...</p>
        </div>
      </div>
    </div>
  );
}

// NOTE: SSR 비활성화
const SearchPageClient = dynamic(
  () => import('./_modules/SearchPageClient').then(mod => mod.SearchPageClient),
  {
    ssr: false,
    // NOTE: loading 옵션 있지만 useSearchParams 사용 때문에 Suspense 필요
  },
);

// 메인 페이지 컴포넌트
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageClient />
    </Suspense>
  );
}
