import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          'border-red bg-gray-700 text-white active:bg-gray-400 disabled:bg-gray-50 disabled:text-gray-200',
        secondary:
          'border border-gray-100 bg-white text-gray-700 disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-200',
        error: 'bg-red text-white',
        ghost: 'bg-transparent text-black',
      },
      size: {
        xs: 'w-auto gap-0.5 px-2 py-1 ui-text-sub-head-3', // NOTE: xs, sm은 너비, 높이가 정해져 있지 않음
        sm: 'w-auto gap-1 px-3 py-2 ui-text-sub-head-2',
        md: 'box-border h-13 w-full ui-text-sub-head',
        lg: 'box-border h-14 w-full ui-text-sub-head',
      },
      rounded: {
        default: 'rounded-[8px]',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      rounded: 'default',
    },
  },
);

export function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    />
  );
}
