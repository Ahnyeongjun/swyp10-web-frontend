import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TrendingSearchItem } from './TrendingSearchItem';
import { mockTrendingData } from './mock-data';

const meta: Meta<typeof TrendingSearchItem> = {
  title: 'Search/TrendingSearchItem',
  component: TrendingSearchItem,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div className='w-[320px] bg-white p-5'>
        <h2 className='mb-5 text-[14px] leading-[20px] font-semibold tracking-[-0.14px] text-[#090a0c]'>
          인기 검색어
        </h2>
        <div className='flex flex-col gap-3'>
          <Story />
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TopRanked: Story = {
  args: {
    item: mockTrendingData[0],
    onSearch: (keyword: string) => console.log('Search:', keyword),
  },
};

export const MidRanked: Story = {
  args: {
    item: mockTrendingData[3],
    onSearch: (keyword: string) => console.log('Search:', keyword),
  },
};

export const LowRanked: Story = {
  args: {
    item: mockTrendingData[9],
    onSearch: (keyword: string) => console.log('Search:', keyword),
  },
};

export const FullList: Story = {
  render: args => (
    <>
      {mockTrendingData.map(item => (
        <TrendingSearchItem
          key={item.id}
          item={item}
          onSearch={args.onSearch}
        />
      ))}
    </>
  ),
  args: {
    onSearch: (keyword: string) => console.log('Search:', keyword),
  },
};
