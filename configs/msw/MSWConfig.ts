import { SharedOptions, delay, http } from 'msw';

export const globalDelay = http.all('*', async ({ request: req }) => {
  if (PATHS_IGNORED_BY_MSW.find(path => req.url.includes(path))) {
    return;
  }

  await delay();
});

const PATHS_IGNORED_BY_MSW = [
  '/src',
  '/_next',
  '/virtual',
  '/.storybook',
  '.vite',
  '.json',
  'favicon',
  'fonts',
];

type OnUnHandledRequest = SharedOptions['onUnhandledRequest'];

export const MSWIgnoreDevResources: OnUnHandledRequest = (req, print) => {
  if (PATHS_IGNORED_BY_MSW.find(path => req.url.includes(path))) {
    return;
  }

  print.warning();
};
