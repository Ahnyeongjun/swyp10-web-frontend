'use client';

import { PropsWithChildren, useLayoutEffect } from 'react';

import { setupWorker } from 'msw/browser';

import { getHealthCheck } from '@/mocks/api';

import { MSWIgnoreDevResources, globalDelay } from './MSWConfig';

const initializeMSWOnClient = () => {
  const handlers = [globalDelay, ...getHealthCheck];

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
    if (process.env.NODE_ENV === 'development') {
      initializeMSWOnClient();
    }
  }, []);

  return <>{children}</>;
};
