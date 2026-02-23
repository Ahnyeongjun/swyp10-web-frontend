'use client';

import { useRouter } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className='relative box-border flex h-screen w-full max-w-[600px] flex-col px-5'>
      <div className='sticky top-0 z-10 flex w-full flex-col bg-transparent pb-2'>
        <div className='-mx-2 box-border flex w-full flex-row items-center justify-start py-0'>
          <button
            onClick={handleGoHome}
            className='relative flex size-8 shrink-0 items-center justify-center'
          >
            {/* TODO: 아이콘 추출 */}
            <svg
              width='7'
              height='13'
              viewBox='0 0 7 13'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6 1L1 6.5L6 12'
                stroke='#868C98'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>

      <div className='flex-1'>{children}</div>
    </div>
  );
}
