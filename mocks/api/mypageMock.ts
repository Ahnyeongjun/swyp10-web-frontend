import { faker } from '@faker-js/faker/locale/ko';
import { HttpResponse, http } from 'msw';


const wrapResponse = <T>(data: T) => ({
  success: true,
  data,
  message: null,
  code: null,
  errorDetail: null,
});

const createPagedResponse = <T>(content: T[], page = 0, size = 20) => ({
  content,
  page,
  size,
  totalElements: content.length + faker.number.int({ min: 0, max: 20 }),
  totalPages: Math.ceil((content.length + faker.number.int({ min: 0, max: 20 })) / size),
  first: page === 0,
  last: content.length < size,
  empty: content.length === 0,
});

export const mypageHandlers = [
  // 사용자 정보 변경
  http.patch(`*/api/v1/mypage/me`, ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname') || '새닉네임';
    return HttpResponse.json(
      wrapResponse({
        userId: faker.number.int({ min: 1, max: 9999 }),
        nickname,
        profileImage: faker.image.avatar(),
      }),
    );
  }),

  // 리뷰 목록 조회
  http.get(`*/api/v1/mypage/reviews`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const reviews = Array.from({ length: faker.number.int({ min: 0, max: 8 }) }, () => ({
      id: faker.number.int({ min: 1, max: 9999 }),
      festivalId: faker.number.int({ min: 1, max: 9999 }),
      festivalTitle: faker.helpers.arrayElement([
        '서울 빛초롱 축제',
        '부산 불꽃 축제',
        '전주 비빔밥 축제',
      ]),
      festivalThumbnail: faker.image.urlPicsumPhotos({ width: 200, height: 150 }),
      content: faker.lorem.sentences({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 60 }).toISOString(),
    }));
    return HttpResponse.json(wrapResponse(createPagedResponse(reviews, page, size)));
  }),

  // 리뷰 삭제
  http.delete(`*/api/v1/mypage/reviews/:reviewId`, () => {
    return HttpResponse.json(wrapResponse(null));
  }),

  // 북마크 취소
  http.delete(`*/api/v1/mypage/bookmarks/:festivalId`, () => {
    return HttpResponse.json(wrapResponse(null));
  }),
];
