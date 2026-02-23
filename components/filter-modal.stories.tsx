import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';
import FilterModal, { FilterConfig, FilterValues } from './filter-modal';

const meta: Meta<typeof FilterModal> = {
  title: 'Components/FilterModal',
  component: FilterModal,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
FilterModal은 여러 필터 옵션을 제공하는 바텀시트 모달 컴포넌트입니다.

## 특징
- 다중 필터 섹션 지원
- 상태 관리 및 초기화 기능
- 트리거 요소 제공
- 유연한 설정을 통한 재사용성
- 바텀시트 형태의 모달 UI

## 사용 사례
- 축제/이벤트 필터링
- 상품 검색 필터
- 콘텐츠 카테고리 필터
- 설정 옵션 선택
        `,
      },
    },
  },
  decorators: [
    Story => (
      <div className='h-[400px] p-4'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 축제 필터 설정
const festivalFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: '축제 진행 여부',
    list: [
      { type: 'ongoing', label: '진행 중' },
      { type: 'upcoming', label: '예정' },
    ],
  },
  {
    key: 'period',
    label: '기간',
    list: [
      { type: 'this_week', label: '이번 주' },
      { type: 'this_month', label: '이번 달' },
      { type: 'next_month', label: '다음 달' },
    ],
  },
  {
    key: 'withWhom',
    label: '누구랑',
    list: [
      { type: 'alone', label: '혼자' },
      { type: 'friends', label: '친구들과' },
      { type: 'family', label: '가족과' },
      { type: 'couple', label: '연인과' },
    ],
  },
  {
    key: 'theme',
    label: '테마',
    list: [
      { type: 'CULTURE_ART', label: '문화/예술' },
      { type: 'FOOD', label: '음식/미식' },
      { type: 'MUSIC', label: '음악/공연' },
      { type: 'NATURE', label: '자연/체험' },
      { type: 'TRADITION', label: '전통/역사' },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleApply = (values: FilterValues) => {
      console.log('Applied filters:', values);
      alert(`필터 적용: ${JSON.stringify(values, null, 2)}`);
      setOpen(false);
    };

    const handleReset = (values: FilterValues) => {
      console.log('Reset filters:', values);
    };

    return (
      <FilterModal
        title='축제 필터'
        configs={festivalFilterConfigs}
        onApply={handleApply}
        onReset={handleReset}
        open={open}
        onOpenChange={setOpen}
        triggerElement={
          <Button variant='primary' size='lg'>
            필터 열기
          </Button>
        }
      />
    );
  },
};

export const WithInitialValues: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const initialValues: FilterValues = {
      status: 'ongoing',
      theme: 'MUSIC',
      withWhom: 'family',
    };

    const handleApply = (values: FilterValues) => {
      console.log('Applied filters:', values);
      alert(`필터 적용: ${JSON.stringify(values, null, 2)}`);
      setOpen(false);
    };

    return (
      <FilterModal
        title='초기값 설정된 필터'
        configs={festivalFilterConfigs}
        initialValues={initialValues}
        onApply={handleApply}
        open={open}
        onOpenChange={setOpen}
        triggerElement={
          <Button variant='primary' size='lg'>
            초기값이 있는 필터 열기
          </Button>
        }
      />
    );
  },
};

export const CustomButtonText: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleApply = (values: FilterValues) => {
      console.log('Applied filters:', values);
      alert(`검색 실행: ${JSON.stringify(values, null, 2)}`);
      setOpen(false);
    };

    return (
      <FilterModal
        title='검색 필터'
        configs={festivalFilterConfigs}
        onApply={handleApply}
        resetButtonText='모두 지우기'
        applyButtonText='검색하기'
        open={open}
        onOpenChange={setOpen}
        triggerElement={
          <Button variant='secondary' size='lg'>
            커스텀 버튼 텍스트
          </Button>
        }
      />
    );
  },
};

export const SimpleFilter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const simpleConfigs: FilterConfig[] = [
      {
        key: 'category',
        label: '카테고리',
        list: [
          { type: 'electronics', label: '전자제품' },
          { type: 'clothing', label: '의류' },
          { type: 'books', label: '도서' },
        ],
      },
      {
        key: 'price',
        label: '가격대',
        list: [
          { type: 'low', label: '10만원 이하' },
          { type: 'medium', label: '10-50만원' },
          { type: 'high', label: '50만원 이상' },
        ],
      },
    ];

    const handleApply = (values: FilterValues) => {
      console.log('Applied filters:', values);
      alert(`상품 필터 적용: ${JSON.stringify(values, null, 2)}`);
      setOpen(false);
    };

    return (
      <FilterModal
        title='상품 필터'
        configs={simpleConfigs}
        onApply={handleApply}
        open={open}
        onOpenChange={setOpen}
        triggerElement={
          <Button variant='primary' size='lg'>
            간단한 필터
          </Button>
        }
      />
    );
  },
};
