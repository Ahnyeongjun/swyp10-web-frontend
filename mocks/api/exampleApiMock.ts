import { HttpResponse, http } from 'msw';

// NOTE: MSW 예제이며 제거 예정
export const getHealthCheck = [
  http.get(`${process.env.NEXT_API_BASE_URL}v1/health`, () => {
    return HttpResponse.json({
      status: 200,
      data: null,
      message: 'OK',
    });
  }),
];
