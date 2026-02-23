import { NextRequest, NextResponse } from 'next/server';

import {
  FestivalCalendarRequestRegion,
  FestivalCalendarRequestTheme,
  FestivalCalendarRequestWithWhom,
} from '@/apis/SWYP10BackendAPI.schemas';
import config from '@/config';

// 백엔드 API 직접 호출을 위한 함수
const callBackendAPI = async (requestData: {
  page: number;
  size: number;
  sort: string;
  region: FestivalCalendarRequestRegion;
  withWhom: FestivalCalendarRequestWithWhom;
  theme: FestivalCalendarRequestTheme;
  date?: string;
  offset: number;
}) => {
  try {
    // 액세스 토큰 가져오기
    let accessToken = '';
    try {
      const tokenResponse = await fetch(
        `${config.api.baseURL}/api/v1/auth/access-token`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        accessToken = tokenData.accessToken;
      }
    } catch (tokenError) {
      console.log('Token fetch failed, proceeding without token:', tokenError);
    }

    // URL 파라미터 구성
    const params = new URLSearchParams({
      page: requestData.page.toString(),
      size: requestData.size.toString(),
      sort: requestData.sort,
      region: requestData.region?.toString() || 'ALL',
      withWhom: requestData.withWhom?.toString() || 'ALL',
      theme: requestData.theme?.toString() || 'ALL',
      offset: requestData.offset.toString(),
    });

    // date가 있을 때만 파라미터에 추가
    if (requestData.date) {
      params.set('date', requestData.date);
    }

    // 백엔드 API 호출
    const response = await fetch(
      `${config.api.baseURL}/api/v1/festivals/calendar?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Backend API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Backend API call failed:', error);
    throw error;
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sort = searchParams.get('sort') || 'createdAt,desc';
    const region =
      (searchParams.get('region') as FestivalCalendarRequestRegion) ||
      FestivalCalendarRequestRegion.ALL;
    const withWhom =
      (searchParams.get('withWhom') as FestivalCalendarRequestWithWhom) ||
      FestivalCalendarRequestWithWhom.ALL;
    const theme =
      (searchParams.get('theme') as FestivalCalendarRequestTheme) ||
      FestivalCalendarRequestTheme.ALL;
    const date = searchParams.get('date') || undefined;
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('API Route - Request params:', {
      page,
      size,
      sort,
      region,
      withWhom,
      theme,
      date,
      offset,
    });

    const requestData = {
      page,
      size,
      sort,
      region,
      withWhom,
      theme,
      date,
      offset,
    };

    console.log('API Route - Calling backend API with:', requestData);

    // 백엔드 API 직접 호출
    const response = await callBackendAPI(requestData);

    console.log('API Route - Response received:', {
      contentLength: response.content?.length || 0,
      totalElements: response.totalElements,
    });

    console.log('response::::', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Festival calendar API error:', error);

    // 더 자세한 에러 정보 제공
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch festivals',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
