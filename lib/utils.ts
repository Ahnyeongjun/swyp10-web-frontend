import { type ClassValue, clsx } from 'clsx';

import { customTwMerge } from '@/configs/tailwind';

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
