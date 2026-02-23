'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';
import BottomSheet, { BottomSheetRef } from '@/components/bottom-sheet';
import { regionList } from '@/constants/regionList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';

interface BottomFilterProps {
  initialParams: {
    region: string;
    withWhom: string;
    theme: string;
  };
}
export default function BottomFilter({ initialParams }: BottomFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [region, setRegion] = useState<string | null>(
    initialParams?.region || null,
  );
  const [withWhom, setWithWhom] = useState<string | null>(
    initialParams?.withWhom || null,
  );
  const [theme, setTheme] = useState<string | null>(
    initialParams?.theme || null,
  );

  // 쿼리 파라미터가 변경될 때마다 내부 상태 동기화
  useEffect(() => {
    const currentRegion = searchParams.get('region');
    const currentWithWhom = searchParams.get('withWhom');
    const currentTheme = searchParams.get('theme');

    setRegion(currentRegion);
    setWithWhom(currentWithWhom);
    setTheme(currentTheme);
  }, [searchParams]);

  const handleReset = () => {
    // 상태 초기화
    setRegion(null);
    setWithWhom(null);
    setTheme(null);

    // 쿼리 파라미터에서 필터 관련 파라미터 제거
    const params = new URLSearchParams(searchParams);
    params.delete('region');
    params.delete('withWhom');
    params.delete('theme');

    // 페이지를 새로고침하여 쿼리 파라미터 적용
    router.replace(`?${params.toString()}`);

    // drawer 닫기
    bottomSheetRef.current?.close();
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    // 필터 값들을 쿼리 파라미터로 업데이트
    if (region) {
      params.set('region', region);
    } else {
      params.delete('region');
    }

    if (withWhom) {
      params.set('withWhom', withWhom);
    } else {
      params.delete('withWhom');
    }

    if (theme) {
      params.set('theme', theme);
    } else {
      params.delete('theme');
    }

    // 페이지를 새로고침하여 쿼리 파라미터 적용
    router.replace(`?${params.toString()}`);

    // drawer 닫기
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      title={'필터'}
      footerChildren={
        <div className='flex items-center gap-2'>
          <Button onClick={handleReset} size='lg' variant='secondary'>
            초기화
          </Button>
          <Button onClick={handleApply} size='lg' variant='primary'>
            적용하기
          </Button>
        </div>
      }
    >
      <div className='flex flex-col items-center justify-center px-4'>
        <div className='my-4 flex w-full max-w-[600px] flex-col justify-center gap-5'>
          <FilterSection
            label={'지역'}
            list={regionList}
            value={region}
            setValue={setRegion}
          />
          <FilterSection
            label={'누구랑'}
            list={withWhomList}
            value={withWhom}
            setValue={setWithWhom}
          />
          <FilterSection
            label={'테마'}
            list={themeList}
            value={theme}
            setValue={setTheme}
          />
        </div>
      </div>
    </BottomSheet>
  );
}

function FilterSection({
  label,
  list,
  value,
  setValue,
}: {
  label: string;
  list: { type: string; label: string }[];
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  function FilterItem({
    itemLabel,
    onclick,
    checked,
  }: {
    itemLabel: string;
    onclick: () => void;
    checked: boolean;
  }) {
    return (
      <div
        className={`flex h-[36px] w-[76px] items-center justify-center rounded-lg ${checked ? 'border border-gray-400 bg-gray-50' : 'border border-gray-100'} cursor-pointer`}
        onClick={onclick}
      >
        {itemLabel}
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-2'>
      <p className='ui-text-sub-head'>{label}</p>
      <div className='flex flex-wrap gap-x-1 gap-y-2'>
        {list.map(item => {
          return (
            <FilterItem
              checked={value === item.type}
              itemLabel={item.label}
              key={item.type}
              onclick={() => {
                setValue(item.type);
              }}
            />
          );
        })}
        <FilterItem
          checked={value === null}
          itemLabel={'전체'}
          onclick={() => {
            setValue(null);
          }}
        />
      </div>
    </div>
  );
}
