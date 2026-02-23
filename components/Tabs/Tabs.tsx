import * as React from 'react';
import { createContext, useContext, useState } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const tabsVariants = cva('relative flex w-full items-center', {
  variants: {
    variant: {
      default: '',
      underline: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const tabVariants = cva(
  'relative flex cursor-pointer items-center justify-center transition-all',
  {
    variants: {
      variant: {
        default: 'flex-1 py-3',
        underline: 'flex-1 py-3',
      },
      size: {
        sm: 'ui-text-sub-head-3',
        md: 'ui-text-body-2',
        lg: 'ui-text-sub-head',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

interface TabsContextType {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs<Values extends string>({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof tabsVariants> & {
    children: React.ReactNode;
    defaultValue?: Values;
    value?: Values;
    onValueChange?: (value: Values) => void;
  }) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const selectedValue = value !== undefined ? value : internalValue;
  const handleValueChange = (newValue: Values) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      // @ts-expect-error FIXME: 제네릭 지원이 없어서 추후 개선 예정
      value={{ selectedValue, onValueChange: handleValueChange }}
    >
      <div
        className={cn(tabsVariants({ variant, size, className }))}
        {...props}
      >
        <div className='flex w-full'>{children}</div>
        <div className='absolute right-0 bottom-0 left-0 h-px bg-gray-200'></div>
      </div>
    </TabsContext.Provider>
  );
}

export function Tab<Values extends string>({
  label,
  value,
  onClick,
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof tabVariants> & {
    label: string;
    value: Values;
    onClick?: () => void;
  }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tab must be used within Tabs');
  }

  const { selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange(value);
    onClick?.();
  };

  return (
    <div
      className={cn(tabVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    >
      <p className={cn(isSelected ? 'text-gray-900' : 'text-gray-500')}>
        {label}
      </p>
      {isSelected && (
        <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-gray-900'></div>
      )}
    </div>
  );
}
