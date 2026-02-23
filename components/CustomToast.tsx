'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { toast } from 'sonner';

/**
 * 사용 예시
 * showCustomToast({ message: '북마크에 추가되었습니다.', type: 'success' });
 */

interface CustomToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
  loginButton?: boolean;
}

const colorMap = {
  success: 'bg-gray-600',
  info: 'bg-gray-600',
  error: 'bg-[#ee0000]',
};

export const showCustomToast = ({
  message,
  type,
  loginButton,
}: CustomToastProps) => {
  const bgColor = colorMap[type];
  toast.custom(t => {
    return (
      <div
        className={`flex w-[320px] items-center justify-between rounded-sm px-4 py-3 text-white ${bgColor}`}
      >
        <div className='flex items-center gap-2'>
          {type === 'success' ? (
            <Icon icon='lets-icons:check-round-fill' fontSize={20} />
          ) : type === 'info' ? (
            <Icon icon='material-symbols:info-outline' fontSize={20} />
          ) : (
            <Icon icon='icon-park-solid:close-one' fontSize={20} />
          )}
          <p className='ui-text-sub-head-2'>{message}</p>
        </div>
        <div className='flex flex-row items-center gap-2'>
          {loginButton && (
            <Link href='/login' className='ui-text-sub-head-3'>
              로그인
            </Link>
          )}
          <Icon
            icon='material-symbols:close-rounded'
            className='cursor-pointer'
            fontSize={20}
            onClick={() => toast.dismiss(t)}
          />
        </div>
      </div>
    );
  });
};
