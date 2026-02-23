import { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { oauthLogin } from '@/apis/SWYP10BackendAPI';

export async function GET(req: NextRequest) {
  try {
    const kakaoOAuthCode = validateKakaoOAuthCode(req);
    const response = await getAccessToken(kakaoOAuthCode);

    const { accessToken, needsAdditionalSignup } = response.data;

    await setAccessTokenCookie(accessToken);

    return NextResponse.redirect(
      new URL(needsAdditionalSignup ? '/additional-signup' : '/', req.url),
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: HttpStatusCode.BadRequest });
  }
}

function validateKakaoOAuthCode(req: NextRequest) {
  const kakaoOAuthCode = req.nextUrl.searchParams.get('code');
  if (!kakaoOAuthCode) {
    throw new Error('Kakao OAuth code is required');
  }

  return kakaoOAuthCode;
}

async function getAccessToken(kakaoOAuthCode: string) {
  const response = await oauthLogin('kakao', {
    code: kakaoOAuthCode,
  });

  return response;
}

async function setAccessTokenCookie(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set('accessToken', accessToken, {
    // NOTE: `domain` 값 없으면 현재 도메인 범위로 설정됨
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
}
