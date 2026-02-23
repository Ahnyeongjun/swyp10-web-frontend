import { faker } from '@faker-js/faker/locale/ko';
import { HttpResponse, http } from 'msw';


const wrapResponse = <T>(data: T) => ({
  success: true,
  data,
  message: null,
  code: null,
  errorDetail: null,
});

export const authHandlers = [
  // OAuth 인가 코드 로그인
  http.post(`*/api/v1/auth/oauth/login/:provider`, () => {
    return HttpResponse.json(
      wrapResponse({
        accessToken: faker.string.alphanumeric(128),
        tokenType: 'Bearer',
        expiresIn: 3600,
        userId: faker.number.int({ min: 1, max: 9999 }),
        nickname: faker.person.fullName(),
        needsAdditionalSignup: false,
      }),
    );
  }),

  // 토큰 연장
  http.post(`*/api/v1/auth/refresh`, () => {
    return HttpResponse.json(
      wrapResponse({
        accessToken: faker.string.alphanumeric(128),
        tokenType: 'Bearer',
        expiresIn: 3600,
        userId: faker.number.int({ min: 1, max: 9999 }),
        nickname: faker.person.fullName(),
        needsAdditionalSignup: false,
      }),
    );
  }),

  // 사용자 정보 조회
  http.get(`*/api/v1/auth/me`, () => {
    return HttpResponse.json(
      wrapResponse({
        userId: faker.number.int({ min: 1, max: 9999 }),
        email: faker.internet.email(),
        nickname: faker.person.fullName(),
      }),
    );
  }),
];
