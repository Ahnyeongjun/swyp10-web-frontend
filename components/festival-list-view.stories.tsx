import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import FestivalListView from './festival-list-view';

const meta: Meta<typeof FestivalListView> = {
  title: 'Components/FestivalListView',
  component: FestivalListView,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div className='p-4'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CultureArt: Story = {
  args: {
    image: 'https://picsum.photos/seed/culture-art/300/300',
    theme: 'CULTURE_ART',
    title: '서울 아트페어 2024 - 현대 미술의 새로운 지평을 열다',
    loc: '서울 코엑스',
    start_date: '2024-03-15',
    end_date: '2024-03-20',
    is_marked: false,
  },
};

export const CultureArtMarked: Story = {
  args: {
    image: 'https://picsum.photos/seed/culture-art/300/300',
    theme: 'CULTURE_ART',
    title: '서울 아트페어 2024 - 현대 미술의 새로운 지평을 열다',
    loc: '서울 코엑스',
    start_date: '2024-03-15',
    end_date: '2024-03-20',
    is_marked: true,
  },
};

export const Food: Story = {
  args: {
    image: 'https://picsum.photos/seed/food-festival/300/300',
    theme: 'FOOD',
    title: '부산 국제 음식 축제 - 세계 각국의 맛을 한자리에서',
    loc: '부산 해운대',
    start_date: '2024-05-10',
    end_date: '2024-05-15',
    is_marked: false,
  },
};

export const Music: Story = {
  args: {
    image: 'https://picsum.photos/seed/music-festival/300/300',
    theme: 'MUSIC',
    title: '펜타포트 락 페스티벌 2024',
    loc: '인천 송도',
    start_date: '2024-08-02',
    end_date: '2024-08-04',
    is_marked: true,
  },
};

export const Nature: Story = {
  args: {
    image: 'https://picsum.photos/seed/nature-festival/300/300',
    theme: 'NATURE',
    title: '제주 들꽃 축제 - 봄꽃과 함께하는 자연 체험',
    loc: '제주도 성산일출봉',
    start_date: '2024-04-20',
    end_date: '2024-05-05',
    is_marked: false,
  },
};

export const Tradition: Story = {
  args: {
    image: 'https://picsum.photos/seed/tradition-festival/300/300',
    theme: 'TRADITION',
    title: '경주 신라문화제 - 천년의 역사가 살아 숨쉬는 축제',
    loc: '경주 대릉원',
    start_date: '2024-10-15',
    end_date: '2024-10-20',
    is_marked: true,
  },
};

export const LongTitle: Story = {
  args: {
    image: 'https://picsum.photos/seed/long-title-festival/300/300',
    theme: 'CULTURE_ART',
    title:
      '제1회 서울 국제 현대미술 박람회 및 아트페어 - 동아시아 최대 규모의 현대미술 전시회로 전세계 작가들이 참여하여 새로운 예술 트렌드를 제시합니다',
    loc: '서울 삼성동 코엑스 전시장',
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    is_marked: false,
  },
};

export const NoImage: Story = {
  args: {
    image: '',
    theme: 'MUSIC',
    title: '이미지가 없는 축제 예시',
    loc: '서울 홍대',
    start_date: '2024-06-01',
    end_date: '2024-06-03',
    is_marked: false,
  },
};

// 뷰포트별 스토리
export const Mobile: Story = {
  args: {
    image: 'https://picsum.photos/seed/mobile-festival/300/300',
    theme: 'CULTURE_ART',
    title: '모바일 뷰 - 서울 아트페어 2024',
    loc: '서울 코엑스',
    start_date: '2024-03-15',
    end_date: '2024-03-20',
    is_marked: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
  decorators: [
    Story => (
      <div className='p-4'>
        <Story />
      </div>
    ),
  ],
};

export const Tablet: Story = {
  args: {
    image: 'https://picsum.photos/seed/tablet-festival/300/300',
    theme: 'FOOD',
    title: '태블릿 뷰 - 부산 국제 음식 축제',
    loc: '부산 해운대',
    start_date: '2024-05-10',
    end_date: '2024-05-15',
    is_marked: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
  decorators: [
    Story => (
      <div className='p-4'>
        <Story />
      </div>
    ),
  ],
};

export const Desktop: Story = {
  args: {
    image: 'https://picsum.photos/seed/desktop-festival/300/300',
    theme: 'MUSIC',
    title: '데스크톱 뷰 - 펜타포트 락 페스티벌 2024',
    loc: '인천 송도',
    start_date: '2024-08-02',
    end_date: '2024-08-04',
    is_marked: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  decorators: [
    Story => (
      <div className='max-w-md p-4'>
        <Story />
      </div>
    ),
  ],
};
