'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button';
import { dialogClose, dialogOpen } from '@/components/Dialog';

export default function MyPageFooter() {
  const router = useRouter();

  return (
    <div className='flex w-full justify-between border-t border-gray-200 bg-white px-5 py-4'>
      <Button
        variant='ghost'
        onClick={() => {
          dialogOpen({
            title: '로그아웃 하시겠습니까?',
            type: 'confirm',
            onApply: async () => {
              await fetch('/api/auth/logout', {
                method: 'DELETE',
              });
              dialogClose();
              router.push('/');
            },
          });
        }}
      >
        <p className='ui-text-body-2 text-gray-300'>로그아웃</p>
      </Button>
      <div className='flex items-center gap-2'>
        <Link href='/privacy'>
          <p className='text-center ui-text-caption text-gray-400'>
            개인정보처리방침
          </p>
        </Link>
        <Link href='/service-term'>
          <p className='text-center ui-text-caption text-gray-400'>이용약관</p>
        </Link>
      </div>
    </div>
  );
}
