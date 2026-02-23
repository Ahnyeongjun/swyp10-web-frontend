import React from 'react';

import type { Preview } from '@storybook/nextjs-vite';
import { mswLoader } from 'msw-storybook-addon';

// Tailwind CSS 스타일 import
import '@/app/globals.css';
import { ReactQueryClientProvider } from '@/app/react-query-provider';
import { initializeMSWOnStorybook } from '@/configs/msw/initializeMSWOnStorybook';

initializeMSWOnStorybook();

const preview: Preview = {
  decorators: [
    Story => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
