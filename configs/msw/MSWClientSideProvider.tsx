'use client';

import { PropsWithChildren, useLayoutEffect } from 'react';

const initializeMSWOnClient = async () => {
  const { setupWorker } = await import('msw/browser');
  const [
    { festivalHandlers },
    { authHandlers },
    { mypageHandlers },
    { searchHandlers },
    { batchHandlers },
  ] = await Promise.all([
    import('@/mocks/api/festivalMock'),
    import('@/mocks/api/authMock'),
    import('@/mocks/api/mypageMock'),
    import('@/mocks/api/searchMock'),
    import('@/mocks/api/batchMock'),
  ]);
  const { MSWIgnoreDevResources, globalDelay } = await import('./MSWConfig');

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
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      initializeMSWOnClient();
    }
  }, []);

  return <>{children}</>;
};
