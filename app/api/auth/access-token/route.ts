import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      accessToken: (await cookies()).get('accessToken')?.value,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
