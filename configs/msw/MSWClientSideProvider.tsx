'use client';

import { PropsWithChildren, useLayoutEffect } from 'react';

import { setupWorker } from 'msw/browser';

import {
  authHandlers,
  batchHandlers,
  festivalHandlers,
  mypageHandlers,
  searchHandlers,
} from '@/mocks/api';

import { MSWIgnoreDevResources, globalDelay } from './MSWConfig';

const initializeMSWOnClient = () => {
  const handlers = [
    globalDelay,
    ...festivalHandlers,
    ...authHandlers,
    ...mypageHandlers,
    ...searchHandlers,
    ...batchHandlers,
  ];

  const worker = setupWorker(...handlers);

  return worker.start({
    onUnhandledRequest: MSWIgnoreDevResources,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
};

export const MSWClientSideProvider = ({ children }: PropsWithChildren) => {
  // NOTE: 모든 자식 useEffect 보다 우선 호출
  useLayoutEffect(() => {
    initializeMSWOnClient();
  }, []);

  return <>{children}</>;
};
