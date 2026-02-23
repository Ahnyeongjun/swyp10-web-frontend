'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';

import { Icon } from '@iconify/react';

import {
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from '@/components/shadcn/drawer';

interface BottomSheetProps {
  title?: string;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
  titleChildren?: React.ReactNode;
  removeIndicator?: boolean;
  zIndex?: number;
}

export interface BottomSheetRef {
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      title,
      children,
      footerChildren,
      titleChildren,
      removeIndicator = false,
      zIndex = 0,
    },
    ref,
  ) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    // 외부에서 사용할 수 있는 메서드 제공
    useImperativeHandle(ref, () => ({
      close: () => {
        closeRef.current?.click();
      },
    }));

    return (
      // BottomSheet 컴포넌트 사용 시 외부에서 Drawer 영역 설정, trigger 세팅 필수
      // <Drawer>
      //   <DrawerTrigger>Open</DrawerTrigger>
      // </Drawer>
      <DrawerContent
        className={`${zIndex ? `z-[${zIndex}]` : ''} flex w-full flex-col items-center justify-center ${removeIndicator ? '[&>div:first-child]:hidden' : ''}`}
      >
        <div className='w-full max-w-[600px]'>
          <DrawerHeader>
            <DrawerTitle>
              {titleChildren ? (
                titleChildren
              ) : (
                <div className='flex items-center justify-between'>
                  <DrawerClose asChild>
                    <Icon
                      icon='ic:baseline-clear'
                      className='cursor-pointer text-gray-700'
                      fontSize={16}
                    />
                  </DrawerClose>
                  <p className='ui-text-sub-head-2'>{title}</p>
                  <div />
                </div>
              )}
            </DrawerTitle>
          </DrawerHeader>
          {children}
          {!!footerChildren && <DrawerFooter>{footerChildren}</DrawerFooter>}
        </div>
        {/* 숨겨진 DrawerClose 버튼을 ref로 참조 */}
        <DrawerClose ref={closeRef} className='hidden' />
      </DrawerContent>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
