/**
 * @deprecated 이 파일의 북마크 관련 hooks는 더 이상 사용되지 않습니다.
 * 대신 @/hooks/useBookmark를 사용하세요.
 *
 * 새로운 사용법:
 * import { useBookmark } from '@/hooks/useBookmark';
 * const { toggleBookmark } = useBookmark();
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, HttpStatusCode } from 'axios';

import { showCustomToast } from '@/components/CustomToast';

import * as api from '../SWYP10BackendAPI';
import { festivalDetail } from '../queries/festival';

export const useAddBookmark = (festivalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.addBookmark(festivalId),
    onSuccess: async () => {
      await queryClient.invalidateQueries(festivalDetail(festivalId));
      showCustomToast({
        message: '북마크에 추가되었습니다.',
        type: 'success',
      });
    },
    onError: async error => {
      if (error instanceof AxiosError) {
        if (error.response?.status === HttpStatusCode.Forbidden) {
          showCustomToast({
            message: '로그인이 필요합니다.',
            type: 'info',
            loginButton: true,
          });
          return;
        }

        showCustomToast({
          message: `오류가 발생했습니다 (${error.response?.data.message})`,
          type: 'error',
        });
      }
    },
  });
};

export const useRemoveBookmark = (festivalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.cancelBookmark(festivalId),
    onSuccess: async () => {
      showCustomToast({
        message: '북마크에서 제거되었습니다.',
        type: 'success',
      });
      queryClient.invalidateQueries(festivalDetail(festivalId));
    },
    onError: async error => {
      if (error instanceof AxiosError) {
        showCustomToast({
          message: `오류가 발생했습니다 (${error.response?.data.message})`,
          type: 'error',
        });
      }
    },
  });
};
