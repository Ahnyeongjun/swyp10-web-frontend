'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import introImage from '@/assets/images/festival-recommendation/intro.png';
import { Button } from '@/components/Button';
import { CustomDialog } from '@/components/Dialog';
import { useAuth } from '@/hooks/useAuth';
import { getSurveyResult } from '@/utils/localStorage';

export default function CustomizedPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        // 로그인된 사용자만 저장된 설문 결과 확인
        const savedResult = getSurveyResult(true);
        if (savedResult) {
          router.push(`/survey-result?type=${savedResult.type}`);
          return;
        }
      } else {
        // 로그인되지 않은 사용자는 로그인 모달 표시
        setShowLoginModal(true);
      }
    }
  }, [isLoggedIn, isLoading, router]);

  const handleStartTest = () => {
    router.push('/survey');
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className='relative w-full bg-white'>
        <div className='flex flex-col items-center justify-center px-6 py-12'>
          <div className='flex w-full max-w-[272px] flex-col items-center gap-12'>
            <div className='flex w-full flex-col items-center gap-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='ui-text-head tracking-[-0.24px] text-black'>
                  나한테 꼭 맞는 축제는?
                </h1>
                <p className='ui-text-body tracking-[-0.16px] text-gray-400'>
                  간단한 테스트를 통해
                  <br />
                  나에게 맞는 축제를 찾아드려요
                </p>
              </div>

              <div className='flex items-center justify-center'>
                <Image
                  src={introImage}
                  alt='맞춤 축제 소개'
                  className='h-full w-full rounded-lg object-cover'
                  width={214}
                  height={300}
                />
              </div>
            </div>

            <div className='w-full'>
              <Button
                variant='primary'
                size='md'
                rounded='full'
                className='w-full'
                onClick={handleStartTest}
                disabled={isLoading}
              >
                테스트 시작하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CustomDialog
        open={showLoginModal}
        onOpenChange={() => {}}
        variant='default'
        size='sm'
        className='max-w-[320px] rounded-xl p-6 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4'
        footer={
          <div className='mt-3 flex flex-1 flex-row gap-2'>
            <Button
              variant='secondary'
              size='md'
              rounded='default'
              onClick={handleCloseModal}
              className='flex-1'
            >
              로그인 없이 할게요
            </Button>
            <Button
              variant='primary'
              size='md'
              rounded='default'
              onClick={handleLoginRedirect}
              className='flex-1'
            >
              로그인하기
            </Button>
          </div>
        }
      >
        <p className='text-center ui-text-sub-head text-black'>
          잠깐! 로그인 없이 시작하면 결과가 사라져요.
          <br />
          로그인 후 맞춤 축제를 받아보세요.
        </p>
      </CustomDialog>
    </>
  );
}
