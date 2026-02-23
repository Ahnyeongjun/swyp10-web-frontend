import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tab, Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
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

export const Default: Story = {
  render: () => (
    <Tabs defaultValue='tab1'>
      <Tab label='첫 번째 탭' value='tab1' />
      <Tab label='두 번째 탭' value='tab2' />
      <Tab label='세 번째 탭' value='tab3' />
    </Tabs>
  ),
};

export const Small: Story = {
  render: () => (
    <Tabs defaultValue='tab1' size='sm'>
      <Tab label='첫 번째 탭' value='tab1' />
      <Tab label='두 번째 탭' value='tab2' />
      <Tab label='세 번째 탭' value='tab3' />
    </Tabs>
  ),
};

export const Large: Story = {
  render: () => (
    <Tabs defaultValue='tab1' size='lg'>
      <Tab label='첫 번째 탭' value='tab1' />
      <Tab label='두 번째 탭' value='tab2' />
      <Tab label='세 번째 탭' value='tab3' />
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue='tab1' variant='underline'>
      <Tab label='첫 번째 탭' value='tab1' />
      <Tab label='두 번째 탭' value='tab2' />
      <Tab label='세 번째 탭' value='tab3' />
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('tab1');

    return (
      <Tabs value={value} onValueChange={setValue}>
        <Tab label='첫 번째 탭' value='tab1' />
        <Tab label='두 번째 탭' value='tab2' />
        <Tab label='세 번째 탭' value='tab3' />
      </Tabs>
    );
  },
};
