import { faker } from '@faker-js/faker/locale/ko';
import { HttpResponse, http } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// 테마 목록
const THEMES = ['CULTURE_ART', 'FOOD', 'MUSIC', 'NATURE', 'TRADITION'] as const;

// 축제 요약 데이터 생성
const createFestivalSummary = (id?: number) => ({
  id: id ?? faker.number.int({ min: 1, max: 9999 }),
  thumbnail: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
  theme: faker.helpers.arrayElement(THEMES),
  title: faker.helpers.arrayElement([
    '서울 빛초롱 축제',
    '부산 불꽃 축제',
    '전주 비빔밥 축제',
    '보령 머드 축제',
    '춘천 닭갈비 축제',
    '강릉 커피 축제',
    '안동 탈춤 페스티벌',
    '진해 군항제',
    '제주 들불 축제',
    '대구 치맥 페스티벌',
    '수원 화성 문화제',
    '공주 백제 문화제',
    '함평 나비 축제',
    '무주 반딧불 축제',
    '김제 지평선 축제',
  ]),
  bookmarked: faker.datatype.boolean(),
  address: faker.location.streetAddress(),
  startDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
  endDate: faker.date.soon({ days: 30 }).toISOString().split('T')[0],
  map_x: String(faker.number.float({ min: 126.5, max: 129.5, fractionDigits: 6 })),
  map_y: String(faker.number.float({ min: 33.5, max: 38.5, fractionDigits: 6 })),
});

// 페이징 응답 래퍼
const createPagedResponse = <T>(content: T[], page = 0, size = 20) => ({
  content,
  page,
  size,
  totalElements: content.length + faker.number.int({ min: 0, max: 50 }),
  totalPages: Math.ceil((content.length + faker.number.int({ min: 0, max: 50 })) / size),
  first: page === 0,
  last: content.length < size,
  empty: content.length === 0,
});

// 공통 응답 래퍼
const wrapResponse = <T>(data: T) => ({
  success: true,
  data,
  message: null,
  code: null,
  errorDetail: null,
});

export const festivalHandlers = [
  // 축제 리스트 조회 - 지도 페이지
  http.get(`${BASE_URL}/api/v1/festivals/map`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '100');
    const festivals = Array.from({ length: faker.number.int({ min: 5, max: Math.min(size, 30) }) }, () =>
      createFestivalSummary(),
    );
    return HttpResponse.json(wrapResponse(createPagedResponse(festivals, page, size)));
  }),

  // 축제 리스트 조회 - 달력 페이지
  http.get(`${BASE_URL}/api/v1/festivals/calendar`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const festivals = Array.from({ length: faker.number.int({ min: 3, max: 15 }) }, () =>
      createFestivalSummary(),
    );
    return HttpResponse.json(wrapResponse(createPagedResponse(festivals, page, size)));
  }),

  // 축제 달력 일별 개수 조회
  http.get(`${BASE_URL}/api/v1/festivals/calendar/daily-count`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate') || '2026-02-01';
    const endDate = url.searchParams.get('endDate') || '2026-02-28';

    const dailyCounts: { date: string; count: number }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dailyCounts.push({
        date: d.toISOString().split('T')[0],
        count: faker.number.int({ min: 0, max: 8 }),
      });
    }

    return HttpResponse.json(
      wrapResponse({ startDate, endDate, dailyCounts }),
    );
  }),

  // 축제 리스트 조회 - 검색 페이지
  http.get(`${BASE_URL}/api/v1/festivals/search`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const festivals = Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () =>
      createFestivalSummary(),
    );
    return HttpResponse.json(wrapResponse(createPagedResponse(festivals, page, size)));
  }),

  // 축제 리스트 조회 - 맞춤 축제 페이지
  http.get(`${BASE_URL}/api/v1/festivals/personal-test`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const festivals = Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () =>
      createFestivalSummary(),
    );
    return HttpResponse.json(wrapResponse(createPagedResponse(festivals, page, size)));
  }),

  // 축제 리스트 조회 - 마이페이지
  http.get(`${BASE_URL}/api/v1/festivals/mypage`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const festivals = Array.from({ length: faker.number.int({ min: 0, max: 8 }) }, () => ({
      ...createFestivalSummary(),
      bookmarked: true,
    }));
    return HttpResponse.json(wrapResponse(createPagedResponse(festivals, page, size)));
  }),

  // 이달의 인기 축제
  http.get(`${BASE_URL}/api/v1/festivals/monthly-top`, () => {
    const festivals = Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => {
      const summary = createFestivalSummary();
      return {
        ...summary,
        overview: faker.lorem.paragraph(),
        map_x: Number(summary.map_x),
        map_y: Number(summary.map_y),
      };
    });
    return HttpResponse.json(
      wrapResponse(createPagedResponse(festivals)),
    );
  }),

  // 축제 상세 조회
  http.get(`${BASE_URL}/api/v1/festivals/:festivalId`, ({ params }) => {
    const festivalId = Number(params.festivalId);
    const detail = {
      id: festivalId,
      title: faker.helpers.arrayElement([
        '서울 빛초롱 축제',
        '부산 불꽃 축제',
        '전주 비빔밥 축제',
      ]),
      address: faker.location.streetAddress(),
      theme: faker.helpers.arrayElement(THEMES),
      startDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      endDate: faker.date.soon({ days: 30 }).toISOString().split('T')[0],
      thumbnail: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
      mapx: String(faker.number.float({ min: 126.5, max: 129.5, fractionDigits: 6 })),
      mapy: String(faker.number.float({ min: 33.5, max: 38.5, fractionDigits: 6 })),
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        contentid: String(faker.number.int({ min: 100000, max: 999999 })),
        originimgurl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
        imgname: faker.lorem.words(2),
        smallimageurl: faker.image.urlPicsumPhotos({ width: 200, height: 150 }),
      })),
      content: {
        title: faker.lorem.sentence(),
        homepage: `<a href="${faker.internet.url()}">${faker.company.name()}</a>`,
        addr1: faker.location.streetAddress(),
        addr2: faker.location.secondaryAddress(),
        overview: faker.lorem.paragraphs(3),
      },
      info: {
        sponsor1: faker.company.name(),
        sponsor1tel: faker.phone.number(),
        eventstartdate: '20260301',
        eventenddate: '20260315',
        playtime: '10:00 ~ 22:00',
        eventplace: faker.location.streetAddress(),
        eventhomepage: faker.internet.url(),
        usetimefestival: '무료',
        discountinfofestival: null,
        spendtimefestival: '약 2시간',
      },
      bookmarked: faker.datatype.boolean(),
    };
    return HttpResponse.json(wrapResponse(detail));
  }),

  // 축제 리뷰 목록 조회
  http.get(`${BASE_URL}/api/v1/festivals/:festivalId/reviews`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const reviews = Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () => ({
      id: faker.number.int({ min: 1, max: 9999 }),
      nickname: faker.person.fullName(),
      profileImage: faker.image.avatar(),
      content: faker.lorem.sentences({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 60 }).toISOString(),
    }));
    return HttpResponse.json(wrapResponse(createPagedResponse(reviews, page, size)));
  }),

  // 리뷰 등록
  http.post(`${BASE_URL}/api/v1/festivals/:festivalId/reviews`, () => {
    return HttpResponse.json(
      wrapResponse(faker.number.int({ min: 1, max: 9999 })),
    );
  }),

  // 북마크 저장
  http.post(`${BASE_URL}/api/v1/festivals/:festivalId/bookmarks`, ({ params }) => {
    return HttpResponse.json(wrapResponse(Number(params.festivalId)));
  }),

  // 여행 코스 조회
  http.get(`${BASE_URL}/api/v1/festivals/:festivalId/travel-courses`, () => {
    const courses = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
      id: faker.number.int({ min: 1, max: 999 }),
      title: faker.helpers.arrayElement([
        '전통 문화 탐방 코스',
        '맛집 투어 코스',
        '자연 힐링 코스',
        '가족 나들이 코스',
        '사진 명소 코스',
      ]),
      time: faker.helpers.arrayElement(['2시간', '3시간', '반나절', '하루']),
    }));
    const nearbyAttractions = Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => ({
      name: faker.helpers.arrayElement([
        '경복궁',
        '남산타워',
        '해운대 해수욕장',
        '한옥마을',
        '성산일출봉',
      ]),
      thumbnail: faker.image.urlPicsumPhotos({ width: 300, height: 200 }),
      mapx: String(faker.number.float({ min: 126.5, max: 129.5, fractionDigits: 6 })),
      mapy: String(faker.number.float({ min: 33.5, max: 38.5, fractionDigits: 6 })),
      descriptionUrl: faker.internet.url(),
    }));
    return HttpResponse.json(wrapResponse({ courses, nearbyAttractions }));
  }),

  // 맛집 조회
  http.get(`${BASE_URL}/api/v1/festivals/:festivalId/restaurants`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const restaurants = Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
      name: faker.helpers.arrayElement([
        '맛있는 한식당',
        '전통 해물탕',
        '숯불 갈비집',
        '할머니 순두부',
        '바다회 센터',
        '전주 콩나물국밥',
      ]),
      address: faker.location.streetAddress(),
      imageUrl: faker.image.urlPicsumPhotos({ width: 300, height: 200 }),
    }));
    return HttpResponse.json(wrapResponse(createPagedResponse(restaurants, page, size)));
  }),
];
