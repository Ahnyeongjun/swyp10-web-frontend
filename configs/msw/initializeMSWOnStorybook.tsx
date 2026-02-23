import { initialize } from 'msw-storybook-addon';

import { MSWIgnoreDevResources } from './MSWConfig';

export const initializeMSWOnStorybook = () => {
  initialize({
    onUnhandledRequest: MSWIgnoreDevResources,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
};
