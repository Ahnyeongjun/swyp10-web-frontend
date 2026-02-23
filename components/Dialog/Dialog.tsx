'use client';

import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { type VariantProps, cva } from 'class-variance-authority';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  'fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-white',
        destructive: 'bg-white',
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

type RefNVariant = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> &
  VariantProps<typeof dialogContentVariants>;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  RefNVariant
>(({ className, children, variant, size, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg leading-none font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// 커스텀 Dialog 컴포넌트
interface CustomDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  /** @deprecated 현재 기획에서 사용하지 않음 */
  description?: string;
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'confirm' | 'alert';
  applyText?: string;
  closeText?: string;
  children?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const CustomDialog = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  CustomDialogProps
>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      variant = 'default',
      size = 'md',
      type = 'confirm',
      applyText = '확인',
      closeText = '취소',
      children,
      className,
      footer,
      ...props
    },
    ref,
  ) => {
    // 방어 코드: 필수 props 검증
    if (open === undefined) {
      console.warn('CustomDialog: open prop is required');
      return null;
    }

    const handleOpenChange = (newOpen: boolean) => {
      try {
        onOpenChange?.(newOpen);
      } catch (error) {
        console.error('CustomDialog onOpenChange error:', error);
      }
    };

    // 기본 footer 생성
    const getDefaultFooter = () => {
      if (footer) return footer;

      if (type === 'alert') {
        return (
          <Button
            variant='primary'
            size='md'
            onClick={() => onOpenChange?.(false)}
          >
            {applyText}
          </Button>
        );
      }

      return (
        <>
          <Button
            variant='secondary'
            size='md'
            onClick={() => onOpenChange?.(false)}
            className='flex-1'
          >
            {closeText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'error' : 'primary'}
            size='md'
            onClick={() => onOpenChange?.(false)}
            className='flex-1'
          >
            {applyText}
          </Button>
        </>
      );
    };

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          ref={ref}
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          {(title || description) && (
            <DialogHeader className='mb-4'>
              {title && (
                <DialogTitle className='text-center whitespace-pre-line'>
                  {title}
                </DialogTitle>
              )}
              {/* 현재 기획에서 사용하지 않음 */}
              {/* {description && (
                <DialogDescription>{description}</DialogDescription>
              )} */}
            </DialogHeader>
          )}
          {children}
          <DialogFooter
            className={type === 'alert' ? 'justify-center' : 'flex-row gap-2'}
          >
            {getDefaultFooter()}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
CustomDialog.displayName = 'CustomDialog';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  CustomDialog,
};
