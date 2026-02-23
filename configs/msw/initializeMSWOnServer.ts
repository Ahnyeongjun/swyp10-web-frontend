import { setupServer } from 'msw/node';

import { getHealthCheck } from '@/mocks/api';

import { MSWIgnoreDevResources, globalDelay } from './MSWConfig';

// USAGE: Node 환경과 Browser 환경에서 mocking 기반이 다르므로 각각 초기화 필요
export const initializeMSWOnServer = () => {
  const handlers = [globalDelay, ...getHealthCheck];

  const server = setupServer(...handlers);

  return server.listen({
    onUnhandledRequest: MSWIgnoreDevResources,
  });
};
