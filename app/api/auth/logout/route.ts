import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    cookieStore.set('accessToken', '', {
      // NOTE: `domain` 값 없으면 현재 도메인 범위로 설정됨
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ message: '로그아웃되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
