import { HttpResponse, http } from 'msw';


export const batchHandlers = [
  // 축제 동기화 배치 작업
  http.post(`*/batch/run-festival-sync`, () => {
    return HttpResponse.json({
      success: true,
      data: { status: 'completed', syncedCount: 150 },
      message: null,
      code: null,
      errorDetail: null,
    });
  }),
];
