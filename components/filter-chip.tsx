import { Icon } from '@iconify/react';

import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  is_selected: boolean;
  onClick?: () => void;
  downChevron?: boolean;
}

export function FilterChip(props: FilterChipProps) {
  const { label, is_selected, onClick, downChevron = false } = props;

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-full px-2 py-1',
        is_selected && 'border border-gray-400 bg-gray-50',
        !is_selected && 'border border-gray-100 bg-white text-gray-700',
      )}
      onClick={onClick}
    >
      {downChevron && (
        <Icon
          icon='jam:chevron-down'
          className={cn(
            is_selected && 'text-gray-700',
            !is_selected && 'text-gray-400',
          )}
          fontSize={16}
        />
      )}
      <p className='ui-text-sub-head-3 whitespace-nowrap'>{label}</p>
    </div>
  );
}

interface SelectedChipProps {
  label: string;
  onClick?: () => void;
}

export function SelectedChip(props: SelectedChipProps) {
  const { label, onClick } = props;

  return (
    <div
      className='flex cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-gray-50 px-2 py-1'
      onClick={onClick}
    >
      <p className='ui-text-sub-head-3 whitespace-nowrap'>{label}</p>
      <Icon icon='ic:baseline-clear' className='text-gray-700' fontSize={16} />
    </div>
  );
}
