import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import FilterSection from './filter-section';

const meta: Meta<typeof FilterSection> = {
  title: 'Components/FilterSection',
  component: FilterSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
FilterSection은 다양한 필터 옵션을 선택할 수 있는 UI 컴포넌트입니다.

## 특징
- 단일 선택 방식의 필터 그룹
- 자동으로 "전체" 옵션 제공 (showAllOption으로 제어 가능)
- 선택된 항목은 시각적으로 강조 표시
- 유연한 데이터 구조 지원

## 사용 사례
- 축제 필터링 (테마, 기간, 진행 상태 등)
- 상품 카테고리 선택
- 검색 필터 옵션
        `,
      },
    },
  },
  decorators: [
    Story => (
      <div className='w-[400px] p-4'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <FilterSection
        label='테마 선택'
        list={[
          { type: 'CULTURE_ART', label: '문화/예술' },
          { type: 'FOOD', label: '음식/미식' },
          { type: 'MUSIC', label: '음악/공연' },
          { type: 'NATURE', label: '자연/체험' },
          { type: 'TRADITION', label: '전통/역사' },
        ]}
        value={value}
        setValue={setValue}
      />
    );
  },
};

export const StatusFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('ongoing');

    return (
      <FilterSection
        label='축제 진행 여부'
        list={[
          { type: 'ongoing', label: '진행 중' },
          { type: 'upcoming', label: '예정' },
        ]}
        value={value}
        setValue={setValue}
      />
    );
  },
};

export const PeriodFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('this_month');

    return (
      <FilterSection
        label='기간'
        list={[
          { type: 'this_week', label: '이번 주' },
          { type: 'this_month', label: '이번 달' },
          { type: 'next_month', label: '다음 달' },
        ]}
        value={value}
        setValue={setValue}
      />
    );
  },
};

export const WithWhomFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('family');

    return (
      <FilterSection
        label='누구랑'
        list={[
          { type: 'alone', label: '혼자' },
          { type: 'friends', label: '친구들과' },
          { type: 'family', label: '가족과' },
          { type: 'couple', label: '연인과' },
          { type: 'colleagues', label: '동료들과' },
        ]}
        value={value}
        setValue={setValue}
      />
    );
  },
};

export const WithoutAllOption: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('medium');

    return (
      <FilterSection
        label='크기 (전체 옵션 없음)'
        list={[
          { type: 'small', label: '작음' },
          { type: 'medium', label: '보통' },
          { type: 'large', label: '큼' },
        ]}
        value={value}
        setValue={setValue}
        showAllOption={false}
      />
    );
  },
};

export const LongLabels: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <FilterSection
        label='긴 라벨 테스트'
        list={[
          { type: 'very_long_option_1', label: '매우 긴 옵션 이름 1' },
          { type: 'very_long_option_2', label: '매우 긴 옵션 이름 2' },
          { type: 'short', label: '짧음' },
        ]}
        value={value}
        setValue={setValue}
      />
    );
  },
};

export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('option5');

    return (
      <FilterSection
        label='많은 옵션'
        list={[
          { type: 'option1', label: '옵션 1' },
          { type: 'option2', label: '옵션 2' },
          { type: 'option3', label: '옵션 3' },
          { type: 'option4', label: '옵션 4' },
          { type: 'option5', label: '옵션 5' },
          { type: 'option6', label: '옵션 6' },
          { type: 'option7', label: '옵션 7' },
          { type: 'option8', label: '옵션 8' },
          { type: 'option9', label: '옵션 9' },
          { type: 'option10', label: '옵션 10' },
        ]}
        value={value}
        setValue={setValue}
      />
    );
  },
};

export const MultipleFilters: Story = {
  render: () => {
    const [theme, setTheme] = useState<string | null>('MUSIC');
    const [status, setStatus] = useState<string | null>('ongoing');
    const [period, setPeriod] = useState<string | null>(null);

    return (
      <div className='space-y-6'>
        <FilterSection
          label='테마'
          list={[
            { type: 'CULTURE_ART', label: '문화/예술' },
            { type: 'FOOD', label: '음식/미식' },
            { type: 'MUSIC', label: '음악/공연' },
            { type: 'NATURE', label: '자연/체험' },
          ]}
          value={theme}
          setValue={setTheme}
        />

        <FilterSection
          label='진행 상태'
          list={[
            { type: 'ongoing', label: '진행 중' },
            { type: 'upcoming', label: '예정' },
          ]}
          value={status}
          setValue={setStatus}
        />

        <FilterSection
          label='기간'
          list={[
            { type: 'this_week', label: '이번 주' },
            { type: 'this_month', label: '이번 달' },
            { type: 'next_month', label: '다음 달' },
          ]}
          value={period}
          setValue={setPeriod}
        />
      </div>
    );
  },
};
