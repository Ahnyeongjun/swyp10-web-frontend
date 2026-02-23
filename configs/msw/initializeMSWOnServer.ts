import { setupServer } from 'msw/node';

import {
  authHandlers,
  batchHandlers,
  festivalHandlers,
  mypageHandlers,
  searchHandlers,
} from '@/mocks/api';

import { MSWIgnoreDevResources, globalDelay } from './MSWConfig';

// USAGE: Node 환경과 Browser 환경에서 mocking 기반이 다르므로 각각 초기화 필요
export const initializeMSWOnServer = () => {
  const handlers = [
    globalDelay,
    ...festivalHandlers,
    ...authHandlers,
    ...mypageHandlers,
    ...searchHandlers,
    ...batchHandlers,
  ];

  const server = setupServer(...handlers);

  return server.listen({
    onUnhandledRequest: MSWIgnoreDevResources,
  });
};
