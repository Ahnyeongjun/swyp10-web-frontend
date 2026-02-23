import { useQuery } from '@tanstack/react-query';

import { GetCurrentUserResult, getCurrentUser } from '@/apis/SWYP10BackendAPI';

interface UseAuthReturn {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: NonNullable<GetCurrentUserResult>['data'] | undefined;
  refetch: () => void;
}

export function useAuth(): UseAuthReturn {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser().then(res => res.data),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const isLoggedIn = !error && !!user;

  return {
    isLoggedIn,
    isLoading,
    user,
    refetch,
  };
}
