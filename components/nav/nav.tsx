'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Nav() {
  const router = useRouter();

  return (
    <div className='flex w-full max-w-[600px] items-center justify-between border-b-1 border-gray-100 px-5 py-2'>
      <Link href='/'>
        <Image src='/image/logo_new.png' alt='logo' width={50} height={50} />
      </Link>
      <div className='flex w-full items-center justify-end gap-3'>
        <Icon
          icon='lets-icons:search'
          fontSize={28}
          onClick={() => {
            router.push('/search');
          }}
          className='cursor-pointer text-gray-600'
        />
        <Image
          src='/image/basic-profile.png'
          alt='profile'
          width={28}
          height={28}
          className='aspect-square cursor-pointer rounded-full object-cover'
          onClick={async () => {
            const accessToken = await fetch('/api/auth/access-token')
              .then(r => r.json())
              .then(r => !!r?.accessToken || false);
            if (accessToken) {
              router.push('/mypage');
            } else router.push('/login');
          }}
        />
      </div>
    </div>
  );
}

interface BackArrowNavProps {
  onClick?: () => void;
  opacityBg?: boolean;
  rightExpand?: React.ReactElement;
}
export default function BackArrowNav({
  onClick,
  opacityBg = false,
  rightExpand = <></>,
}: BackArrowNavProps) {
  const router = useRouter();

  const handleClick = () => {
    return onClick ? onClick : router.back();
  };

  return (
    <div className={`flex items-center justify-between px-5 py-2`}>
      <div
        className={`flex items-center justify-center ${opacityBg ? 'rounded-full' : ''} h-10 w-10`}
        style={{
          backgroundColor: opacityBg ? '#090A0C' : undefined,
          opacity: opacityBg ? 0.2 : undefined,
        }}
      >
        <Icon
          icon='ic:round-keyboard-arrow-left'
          fontSize={32}
          onClick={handleClick}
          className={`cursor-pointer ${opacityBg ? 'text-white' : 'text-gray-300'}`}
          style={{ marginLeft: opacityBg ? undefined : '-10px' }}
        />
      </div>
      {rightExpand}
    </div>
  );
}
