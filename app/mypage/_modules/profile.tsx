'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { UserInfo } from '@/apis/SWYP10BackendAPI.schemas';

interface ProfileProps {
  userInfo: UserInfo | null;
}

export default function Profile({ userInfo }: ProfileProps) {
  const router = useRouter();

  return (
    <div className='flex w-full items-center gap-4 px-5'>
      <Image
        src='/image/basic-profile.png'
        alt='profile'
        width={48}
        height={48}
        className='aspect-square rounded-full object-cover'
      />
      <div className='flex flex-col'>
        <div className='flex items-center gap-1'>
          <p className='ui-text-head-2'>{userInfo?.nickname || '사용자'} 님</p>
          <Icon
            icon='ic:baseline-edit'
            fontSize={20}
            className='cursor-pointer text-gray-300'
            onClick={() => {
              router.push(`/mypage/edit?nickname=${userInfo?.nickname}`);
            }}
          />
        </div>
        <p className='ui-text-body-2'>
          {userInfo?.email || '이메일 정보 없음'}
        </p>
      </div>
    </div>
  );
}
