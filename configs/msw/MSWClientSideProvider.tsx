'use client';

import { PropsWithChildren, useEffect, useState } from 'react';

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

  await worker.start({
    onUnhandledRequest: MSWIgnoreDevResources,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
};

export const MSWClientSideProvider = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeMSWOnClient().then(() => setIsReady(true));
    }
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
};
