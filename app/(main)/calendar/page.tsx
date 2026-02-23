import Calendar from '@/components/Calendar/Calendar';
import { Drawer } from '@/components/shadcn/drawer';
import { regionList } from '@/constants/regionList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';

import BottomFilter from './_modules/bottom-filter';
import List from './_modules/list';

interface SearchParamsType {
  selected: string;
  region: string;
  withWhom: string;
  theme: string;
  isNearBy: string;
  startDate: string;
  endDate: string;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const { selected, region, withWhom, theme, isNearBy, startDate, endDate } =
    await searchParams;

  const list = [];
  if (region) {
    const regionItem = regionList.find(item => item.type === region);
    list.push({ ...regionItem, name: 'region' });
  }
  if (withWhom) {
    const withWhomItem = withWhomList.find(item => item.type === withWhom);
    list.push({ ...withWhomItem, name: 'withWhom' });
  }
  if (theme) {
    const themeItem = themeList.find(item => item.type === theme);
    list.push({
      type: themeItem?.type || '',
      label: themeItem?.label || '',
      name: 'theme',
    });
  }

  return (
    <div className='flex flex-col gap-5'>
      <Calendar initialDate={new Date(selected)} />
      <Drawer>
        <List
          calendarStartDate={startDate}
          calendarEndDate={endDate}
          selected={selected}
          paramsList={list}
          isNearBy={isNearBy === 'true'}
        />
        <BottomFilter initialParams={{ region, withWhom, theme }} />
      </Drawer>
    </div>
  );
}
