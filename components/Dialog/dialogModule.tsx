'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Button } from '@/components/Button';

// Dialog 컴포넌트
import { CustomDialog } from './Dialog';

export interface DialogConfig {
  id?: string;
  title?: string;
  /** @deprecated 현재 기획에서 사용하지 않음 */
  message?: string;
  type?: 'confirm' | 'alert';
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  applyText?: string;
  closeText?: string;
  onClose?: () => void;
  onApply?: () => void;
  innerElement?: ReactNode;
  footer?: ReactNode;
}

interface DialogItem extends DialogConfig {
  id: string;
}

interface DialogContextType {
  openDialog: (config: DialogConfig) => string;
  closeDialog: (id?: string) => void;
  closeAllDialogs: () => void;
  clearAllDialogs: () => void; // DialogClear 함수 추가
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
};

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<DialogItem[]>([]);

  const generateId = () =>
    `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const openDialog = (newConfig: DialogConfig): string => {
    if (!newConfig) return '';

    const id = newConfig.id || generateId();
    const dialogItem: DialogItem = {
      ...newConfig,
      id,
    };

    setDialogs(prev => [...prev, dialogItem]);
    return id;
  };

  const closeDialog = (id?: string) => {
    if (id) {
      // 특정 Dialog 닫기
      setDialogs(prev => prev.filter(dialog => dialog?.id !== id));
    } else {
      // 가장 최근 Dialog 닫기
      setDialogs(prev => prev.slice(0, -1));
    }
  };

  const closeAllDialogs = () => {
    // 모든 Dialog의 onClose 콜백 실행 후 닫기
    dialogs.forEach(dialog => {
      try {
        dialog.onClose?.();
      } catch (error) {
        console.error('Dialog onClose error:', error);
      }
    });
    setDialogs([]);
  };

  const clearAllDialogs = () => {
    // 콜백 없이 모든 Dialog 즉시 닫기
    setDialogs([]);
  };

  const contextValue = {
    openDialog,
    closeDialog,
    closeAllDialogs,
    clearAllDialogs,
  };

  // context를 전역으로 설정
  useEffect(() => {
    setDialogContext(contextValue);
  }, []);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {dialogs.map((dialog, index) => (
        <DialogComponent
          key={dialog.id}
          dialog={dialog}
          isTopMost={index === dialogs.length - 1}
          onClose={() => closeDialog(dialog.id)}
        />
      ))}
    </DialogContext.Provider>
  );
}

interface DialogComponentProps {
  dialog: DialogItem;
  isTopMost: boolean;
  onClose: () => void;
}

function DialogComponent({ dialog, onClose }: DialogComponentProps) {
  const handleClose = () => {
    try {
      if (dialog.onClose) {
        dialog.onClose();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Dialog onClose error:', error);
    }
  };

  const handleApply = () => {
    try {
      dialog.onApply?.();
    } catch (error) {
      console.error('Dialog onApply error:', error);
    }
  };

  // 기본 footer 생성
  const getDefaultFooter = () => {
    if (dialog.footer) return dialog.footer;

    if (dialog?.type === 'alert') {
      return (
        <Button variant='primary' size='md' onClick={handleApply}>
          {dialog?.applyText || '확인'}
        </Button>
      );
    }

    return (
      <>
        <Button
          variant='secondary'
          size='md'
          onClick={handleClose}
          className='flex-1'
        >
          {dialog?.closeText || '취소'}
        </Button>
        <Button
          variant={dialog?.variant === 'destructive' ? 'error' : 'primary'}
          size='md'
          onClick={handleApply}
          className='flex-1'
        >
          {dialog?.applyText || '확인'}
        </Button>
      </>
    );
  };

  return (
    <CustomDialog
      open={true}
      onOpenChange={open => !open && onClose()}
      title={dialog?.title || ''}
      description={dialog?.message || ''}
      type={dialog?.type || 'confirm'}
      variant={dialog?.variant || 'default'}
      size={dialog?.size || 'md'}
      applyText={dialog?.applyText}
      closeText={dialog?.closeText}
      footer={getDefaultFooter()}
    >
      {dialog?.innerElement}
    </CustomDialog>
  );
}

// 간편한 사용을 위한 함수들
let dialogContext: DialogContextType | null = null;

export const setDialogContext = (context: DialogContextType) => {
  if (!context) return;
  dialogContext = context;
};

export const dialogOpen = (config: DialogConfig): string => {
  if (!config) {
    console.warn('Dialog config is required');
    return '';
  }

  if (!dialogContext) {
    console.warn(
      'Dialog context is not initialized. Make sure DialogProvider is mounted.',
    );
    return '';
  }

  try {
    return dialogContext.openDialog(config);
  } catch (error) {
    console.error('Failed to open dialog:', error);
    return '';
  }
};

export const dialogClose = (id?: string) => {
  if (!dialogContext) {
    console.warn(
      'Dialog context is not initialized. Make sure DialogProvider is mounted.',
    );
    return;
  }

  try {
    dialogContext.closeDialog(id);
  } catch (error) {
    console.error('Failed to close dialog:', error);
  }
};

export const dialogCloseAll = () => {
  if (!dialogContext) {
    console.warn(
      'Dialog context is not initialized. Make sure DialogProvider is mounted.',
    );
    return;
  }

  try {
    dialogContext.closeAllDialogs();
  } catch (error) {
    console.error('Failed to close all dialogs:', error);
  }
};

export const dialogClear = () => {
  if (!dialogContext) {
    console.warn(
      'Dialog context is not initialized. Make sure DialogProvider is mounted.',
    );
    return;
  }

  try {
    dialogContext.clearAllDialogs();
  } catch (error) {
    console.error('Failed to clear all dialogs:', error);
  }
};
