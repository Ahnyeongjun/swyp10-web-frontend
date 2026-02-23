import { HttpResponse, http } from 'msw';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const batchHandlers = [
  // 축제 동기화 배치 작업
  http.post(`${BASE_URL}/batch/run-festival-sync`, () => {
    return HttpResponse.json({
      success: true,
      data: { status: 'completed', syncedCount: 150 },
      message: null,
      code: null,
      errorDetail: null,
    });
  }),
];
