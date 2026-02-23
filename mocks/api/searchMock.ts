import { faker } from '@faker-js/faker/locale/ko';
import { HttpResponse, http } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const wrapResponse = <T>(data: T) => ({
  success: true,
  data,
  message: null,
  code: null,
  errorDetail: null,
});

export const searchHandlers = [
  // 인기 검색어 조회
  http.get(`${BASE_URL}/api/v1/search/keywords/top`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || '10');
    const keywords = Array.from({ length: Math.min(limit, 10) }, () => ({
      keyword: faker.helpers.arrayElement([
        '벚꽃 축제',
        '불꽃놀이',
        '맥주 축제',
        '음악 페스티벌',
        '한옥마을',
        '머드 축제',
        '빛 축제',
        '해수욕장',
        '등불 축제',
        '치맥 페스티벌',
      ]),
      count: faker.number.int({ min: 10, max: 500 }),
      lastSearchedAt: faker.date.recent({ days: 7 }).toISOString(),
    }));
    return HttpResponse.json(
      wrapResponse({
        content: keywords,
        page: 0,
        size: limit,
        totalElements: keywords.length,
        totalPages: 1,
        first: true,
        last: true,
        empty: keywords.length === 0,
      }),
    );
  }),
];
