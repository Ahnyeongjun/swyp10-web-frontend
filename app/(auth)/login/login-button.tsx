'use client';

import Image from 'next/image';

import config from '@/config';

export default function LoginButton({
  type,
}: {
  type: 'kakao' | 'naver' | 'not-login';
}) {
  const kakaoUri = config.kakao.redirect_uri;
  const kakaoRestApiKey = config.kakao.rest_api_key;
  const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestApiKey}&redirect_uri=${kakaoUri}&response_type=code`;

  return (
    <div>
      {type === 'not-login' && (
        <a className='cursor-pointer' href={'/'}>
          <div className='flex h-[58px] w-full min-w-[320px] items-center justify-center gap-2.5 rounded-lg border border-gray-50'>
            <p className='ui-text-sub-head-2'>로그인 없이 볼게요</p>
          </div>
        </a>
      )}
      {type === 'kakao' && (
        <a href={kakaoUrl}>
          <div
            className='flex w-full min-w-[320px] items-center justify-center gap-2.5 rounded-lg px-5 py-4.5'
            style={{ backgroundColor: '#FEE500' }}
          >
            <Image
              src='/image/sns/kakao.png'
              alt='kakao'
              width={24}
              height={24}
            />
            <p className='ui-text-sub-head-2'>10초만에 카카오로 시작하기</p>
          </div>
        </a>
      )}
      {type === 'naver' && <a>10초만에 네이버로 시작하기</a>}
    </div>
  );
}
