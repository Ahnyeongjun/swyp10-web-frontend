'use client';

import { useEffect, useState } from 'react';

import { monthlyTopFestival } from '@/apis/SWYP10BackendAPI';
import { monthlyStaticData } from '@/constants/monthly';

import FestivalCard from './_modules/festival-card';
import HeaderImage from './_modules/header-image';

export default function MonthFestivalPage() {
  const [festivals, setFestivals] = useState<any[]>([]);

  useEffect(() => {
    monthlyTopFestival()
      .then(({ data }) => {
        setFestivals(data?.content ?? []);
      })
      .catch(e => {
        console.error('monthlyTopFestival error:', e);
      });
  }, []);

  const staticData = () => {
    const currentMonth = String(new Date().getMonth() + 1);
    const currentYear = String(new Date().getFullYear());

    return monthlyStaticData.find(
      month =>
        month.month === `${currentYear}-${currentMonth.padStart(2, '0')}`,
    );
  };

  return (
    <div className='flex h-full w-full flex-col items-center'>
      <HeaderImage image={staticData()?.image || ''} />
      <div className='mt-4 flex w-full flex-col px-5'>
        <div className='mb-4 flex flex-col gap-1'>
          <p className='ui-text-body-2 text-gray-400'>
            {staticData()?.description || ''}
          </p>
          <p className='ui-text-head-2'>{staticData()?.title || ''}</p>
        </div>
        <div className='box-border flex w-full flex-col gap-8 pb-10'>
          {festivals.map((festival, index) => (
            <FestivalCard
              key={index}
              index={index + 1}
              festival={{
                ...festival,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
