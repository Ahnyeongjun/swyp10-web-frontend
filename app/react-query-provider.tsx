'use client';

import { PropsWithChildren, useState } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { QUERY_OPTIONS } from '@/constants';

// TODO: implement
const noticeUserOnServerError = (error: unknown) => {
  console.error(error);
};

// TODO: implement
const logQueryError = (error: unknown) => {
  console.error(error);
};

// TODO: implement
const logMutationError = (error: unknown) => {
  console.error(error);
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_OPTIONS.STALE_TIME,
        gcTime: QUERY_OPTIONS.GC_TIME,
        retry: QUERY_OPTIONS.RETRY_COUNT,
      },
      mutations: {
        onError: noticeUserOnServerError,
      },
    },
    queryCache: new QueryCache({
      onError: logQueryError,
    }),
    mutationCache: new MutationCache({
      onError: logMutationError,
    }),
  });

export const ReactQueryClientProvider = ({ children }: PropsWithChildren) => {
  // WHY: 모듈 단위로 queryClient를 생성하면 여러 클라이언트 간 데이터가 공유되므로 매번 생성되게 할 필요성 존재
  const [queryClient] = useState(createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
