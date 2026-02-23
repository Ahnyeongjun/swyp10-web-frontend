'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Button } from './Button';
import BottomSheet, { BottomSheetRef } from './bottom-sheet';
import FilterSection, { FilterItem } from './filter-section';
import { Drawer, DrawerTrigger } from './shadcn/drawer';

export interface FilterConfig {
  key: string;
  label: string;
  list: FilterItem[];
  showAllOption?: boolean;
}

export interface FilterValues {
  [key: string]: string | null;
}

interface FilterModalProps {
  title?: string;
  configs: FilterConfig[];
  initialValues?: FilterValues;
  onApply: (values: FilterValues) => void;
  onReset?: (values: FilterValues) => void;
  resetButtonText?: string;
  applyButtonText?: string;
  triggerElement?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface FilterModalRef {
  close: () => void;
  setValues: (values: FilterValues) => void;
  getValues: () => FilterValues;
}

const FilterModal = forwardRef<FilterModalRef, FilterModalProps>(
  (
    {
      title = '필터',
      configs,
      initialValues = {},
      onApply,
      onReset,
      resetButtonText = '초기화',
      applyButtonText = '적용하기',
      triggerElement,
      open,
      onOpenChange,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    // 각 필터의 상태를 관리하는 state 객체
    const [filterValues, setFilterValues] = useState<FilterValues>(() => {
      const initial: FilterValues = {};
      configs.forEach(config => {
        initial[config.key] = initialValues[config.key] || null;
      });
      return initial;
    });

    // 개별 필터 값 업데이트 함수
    const updateFilterValue = (
      key: string,
      value: string | null | ((prev: string | null) => string | null),
    ) => {
      setFilterValues(prev => ({
        ...prev,
        [key]: typeof value === 'function' ? value(prev[key]) : value,
      }));
    };

    const handleReset = () => {
      const resetValues: FilterValues = {};
      configs.forEach(config => {
        resetValues[config.key] = null;
      });

      setFilterValues(resetValues);

      if (onReset) {
        onReset(resetValues);
      }

      bottomSheetRef.current?.close();
    };

    const handleApply = () => {
      onApply(filterValues);
      bottomSheetRef.current?.close();
    };

    // ref를 통한 외부 제어 인터페이스
    useImperativeHandle(ref, () => ({
      close: () => bottomSheetRef.current?.close(),
      setValues: (values: FilterValues) => {
        setFilterValues(prev => ({
          ...prev,
          ...values,
        }));
      },
      getValues: () => filterValues,
    }));

    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {triggerElement && (
          <DrawerTrigger asChild>{triggerElement}</DrawerTrigger>
        )}
        <BottomSheet
          ref={bottomSheetRef}
          title={title}
          footerChildren={
            <div className='flex items-center gap-2'>
              <Button onClick={handleReset} size='lg' variant='secondary'>
                {resetButtonText}
              </Button>
              <Button onClick={handleApply} size='lg' variant='primary'>
                {applyButtonText}
              </Button>
            </div>
          }
        >
          <div className='flex flex-col items-center justify-center px-4'>
            <div className='my-4 flex w-full max-w-[600px] flex-col justify-center gap-5'>
              {configs.map(config => (
                <FilterSection
                  key={config.key}
                  label={config.label}
                  list={config.list}
                  value={filterValues[config.key]}
                  setValue={value => updateFilterValue(config.key, value)}
                  showAllOption={config.showAllOption}
                />
              ))}
            </div>
          </div>
        </BottomSheet>
      </Drawer>
    );
  },
);

FilterModal.displayName = 'FilterModal';

export default FilterModal;
