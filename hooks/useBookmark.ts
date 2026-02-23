import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, HttpStatusCode } from 'axios';

import * as api from '@/apis/SWYP10BackendAPI';
import { festivalDetail } from '@/apis/queries/festival';
import { showCustomToast } from '@/components/CustomToast';

interface UseBookmarkOptions {
  onSuccess?: (festivalId: number, isBookmarked: boolean) => void;
  onError?: (error: Error) => void;
}

export const useBookmark = (options?: UseBookmarkOptions) => {
  const queryClient = useQueryClient();

  const addBookmarkMutation = useMutation({
    mutationFn: (festivalId: number) => api.addBookmark(festivalId),
    onSuccess: async (_, festivalId) => {
      // 축제 상세 정보 쿼리 무효화
      await queryClient.invalidateQueries(festivalDetail(festivalId));

      // 북마크 관련 쿼리들 무효화
      await queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      await queryClient.invalidateQueries({ queryKey: ['festivals'] });

      showCustomToast({
        message: '북마크에 추가되었습니다.',
        type: 'success',
      });

      options?.onSuccess?.(festivalId, true);
    },
    onError: async (error: Error, festivalId: number) => {
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
          message: `오류가 발생했습니다 (${error.response?.data?.message || '알 수 없는 오류'})`,
          type: 'error',
        });
      }

      options?.onError?.(error);
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: (festivalId: number) => api.cancelBookmark(festivalId),
    onSuccess: async (_, festivalId) => {
      // 축제 상세 정보 쿼리 무효화
      await queryClient.invalidateQueries(festivalDetail(festivalId));

      // 북마크 관련 쿼리들 무효화
      await queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      await queryClient.invalidateQueries({ queryKey: ['festivals'] });

      showCustomToast({
        message: '북마크에서 제거되었습니다.',
        type: 'success',
      });

      options?.onSuccess?.(festivalId, false);
    },
    onError: async (error: Error, festivalId: number) => {
      if (error instanceof AxiosError) {
        showCustomToast({
          message: `오류가 발생했습니다 (${error.response?.data?.message || '알 수 없는 오류'})`,
          type: 'error',
        });
      }

      options?.onError?.(error);
    },
  });

  const toggleBookmark = async (
    festivalId: number,
    isCurrentlyBookmarked: boolean,
  ) => {
    if (isCurrentlyBookmarked) {
      await removeBookmarkMutation.mutateAsync(festivalId);
    } else {
      await addBookmarkMutation.mutateAsync(festivalId);
    }
  };

  return {
    addBookmark: addBookmarkMutation.mutateAsync,
    removeBookmark: removeBookmarkMutation.mutateAsync,
    toggleBookmark,
    isAddingBookmark: addBookmarkMutation.isPending,
    isRemovingBookmark: removeBookmarkMutation.isPending,
    isBookmarkLoading:
      addBookmarkMutation.isPending || removeBookmarkMutation.isPending,
  };
};
