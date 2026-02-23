import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HttpResponse, http } from 'msw';

import { SearchPageClient } from './SearchPageClient';

const meta = {
  title: 'Pages/Search/SearchPageClient',
  component: SearchPageClient,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof SearchPageClient>;

export default meta;
type Story = StoryObj<typeof meta>;

// 목업 데이터
const mockFestivalData = [
  {
    id: 1,
    thumbnail: 'https://picsum.photos/200/200?random=1',
    title: '서울 빛의 축제',
    address: '서울특별시 중구 명동',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    theme: 'CULTURE_ART',
  },
  {
    id: 2,
    thumbnail: 'https://picsum.photos/200/200?random=2',
    title: '부산 불꽃축제',
    address: '부산광역시 수영구 광안리',
    startDate: '2024-10-15',
    endDate: '2024-10-15',
    theme: 'MUSIC',
  },
];

const mockKeywords = [
  { keyword: '대구 축제', count: 150, lastSearchedAt: '2024-12-01T10:00:00Z' },
  { keyword: '대구 축제', count: 120, lastSearchedAt: '2024-12-01T09:00:00Z' },
  { keyword: '대구 축제', count: 100, lastSearchedAt: '2024-12-01T08:00:00Z' },
  { keyword: '대구 축제', count: 90, lastSearchedAt: '2024-12-01T07:00:00Z' },
  { keyword: '대구 축제', count: 80, lastSearchedAt: '2024-12-01T06:00:00Z' },
];

// 1. 검색어 없는 상태에서 인기 검색어도 없는 경우
export const NoSearchNoTrending: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: [],
              page: 0,
              size: 10,
              totalElements: 0,
              totalPages: 0,
              first: true,
              last: true,
              empty: true,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: {},
      },
    },
  },
};

// 2. 검색어 없는 상태에서 인기 검색어는 있는 상태인 경우
export const NoSearchWithTrending: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: mockKeywords,
              page: 0,
              size: 10,
              totalElements: 5,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: {},
      },
    },
  },
};

// 3. 검색어가 있는데 검색 결과가 없는 경우 (인기 검색어는 존재)
export const SearchWithNoResultsButTrending: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/festivals/search', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: [],
              page: 0,
              size: 20,
              totalElements: 0,
              totalPages: 0,
              first: true,
              last: true,
              empty: true,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: mockKeywords,
              page: 0,
              size: 10,
              totalElements: 5,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: { q: '차례' },
      },
    },
  },
};

// 4. 검색어가 있는데 검색 결과도 있는 경우
export const SearchWithResults: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/festivals/search', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: mockFestivalData,
              page: 0,
              size: 20,
              totalElements: 2,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: mockKeywords,
              page: 0,
              size: 10,
              totalElements: 5,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: { q: '서울' },
      },
    },
  },
};

// 5. 검색어가 있고, 결과는 없고, 인기 검색어도 없음
export const SearchWithNoResultsNoTrending: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/festivals/search', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: [],
              page: 0,
              size: 20,
              totalElements: 0,
              totalPages: 0,
              first: true,
              last: true,
              empty: true,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: [],
              page: 0,
              size: 10,
              totalElements: 0,
              totalPages: 0,
              first: true,
              last: true,
              empty: true,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: { q: '존재하지않는축제' },
      },
    },
  },
};

// 로딩 상태
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/festivals/search', async () => {
          // 로딩 상태를 보기 위한 지연
          await new Promise(resolve => setTimeout(resolve, 2000));
          return HttpResponse.json({
            success: true,
            data: {
              content: mockFestivalData,
              page: 0,
              size: 20,
              totalElements: 2,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: mockKeywords,
              page: 0,
              size: 10,
              totalElements: 5,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: { q: '서울' },
      },
    },
  },
};

// 에러 상태
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/v1/festivals/search', () => {
          return HttpResponse.json(
            {
              success: false,
              data: null,
              message: '검색 서비스에 문제가 발생했습니다.',
              code: 5000,
              errorDetail: null,
            },
            { status: 500 },
          );
        }),
        http.get('*/api/v1/search/keywords/top', () => {
          return HttpResponse.json({
            success: true,
            data: {
              content: mockKeywords,
              page: 0,
              size: 10,
              totalElements: 5,
              totalPages: 1,
              first: true,
              last: true,
              empty: false,
            },
            message: null,
            code: null,
            errorDetail: null,
          });
        }),
      ],
    },
    nextjs: {
      navigation: {
        pathname: '/search',
        query: { q: '에러테스트' },
      },
    },
  },
};
