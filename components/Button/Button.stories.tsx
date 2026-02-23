import { Icon } from '@iconify/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div className='w-[320px]'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Figma 디자인 예시
export const Primary: Story = {
  args: {
    children: '다음 질문',
    variant: 'primary',
    size: 'lg',
  },
};

export const PrimaryRounded: Story = {
  args: {
    children: '다음 질문',
    variant: 'primary',
    size: 'lg',
    rounded: 'full',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    children: '다음 질문',
    variant: 'primary',
    size: 'lg',
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    children: '다음 질문',
    variant: 'secondary',
    size: 'lg',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    children: '다음 질문',
    variant: 'secondary',
    size: 'lg',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    children: '다음 질문',
    variant: 'error',
    size: 'lg',
  },
};

export const GhostSmall: Story = {
  args: {
    children: '저장',
    variant: 'ghost',
    size: 'sm',
  },
};

export const IconXS: Story = {
  args: {
    children: (
      <>
        <Icon icon='tdesign:edit-filled' fontSize={16} />
        리뷰쓰기
      </>
    ),
    variant: 'primary',
    rounded: 'full',
    size: 'xs',
    className: 'bg-gray-600',
  },
};

export const IconSM: Story = {
  args: {
    children: (
      <>
        <Icon icon='heroicons:map' fontSize={16} />
        지도보기
      </>
    ),
    variant: 'primary',
    rounded: 'full',
    size: 'sm',
    className: 'bg-gray-600',
  },
};
