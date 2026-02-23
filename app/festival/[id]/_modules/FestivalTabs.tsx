import { Tab, Tabs } from '@/components/Tabs';

import { TabType } from '../page';

interface FestivalTabsProps {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function FestivalTabs({
  selectedTab,
  onTabChange,
}: FestivalTabsProps) {
  return (
    <div className='sticky top-0 z-20 bg-white py-2'>
      <Tabs
        value={selectedTab}
        onValueChange={value => onTabChange(value)}
        variant='underline'
      >
        <Tab label='축제 정보' value='festival-info' />
        <Tab label='여행 코스' value='travel-course' />
        <Tab label='주변 맛집' value='restaurants' />
        <Tab label='리뷰' value='reviews' />
      </Tabs>
    </div>
  );
}
