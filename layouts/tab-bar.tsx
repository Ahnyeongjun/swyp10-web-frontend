'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabBar() {
  const pathname = usePathname();
  const LinkClassName = 'flex flex-col items-center gap-px flex-1';

  return (
    <div className='w-full border-t border-gray-400 bg-white py-3'>
      <div className='flex w-full items-center justify-between'>
        <Link
          href='/'
          className={`${LinkClassName} ${pathname === '/' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={pathname === '/' ? 'heroicons:map-solid' : 'heroicons:map'}
            fontSize={24}
            color={pathname === '/' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/' ? 'ui-text-head-3' : 'ui-text-caption'}`}
          >
            축제지도
          </span>
        </Link>
        <Link
          href='/calendar'
          className={`${LinkClassName} ${pathname === '/calendar' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/calendar' ? 'uis:calendar' : 'proicons:calendar'
            }
            fontSize={24}
            color={pathname === '/calendar' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/calendar' ? 'ui-text-head-3' : 'ui-text-caption'}`}
          >
            축제달력
          </span>
        </Link>
        <Link
          href='/month-festival'
          className={`${LinkClassName} ${pathname === '/month-festival' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/month-festival'
                ? 'bxs:calendar-star'
                : 'bx:calendar-star'
            }
            fontSize={24}
            color={pathname === '/month-festival' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/month-festival' ? 'ui-text-head-3' : 'ui-text-caption'}`}
          >
            이달의 축제
          </span>
        </Link>
        {/* <Link
          href='/search'
          className={`${LinkClassName} ${pathname === '/search' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/search'
                ? 'iconamoon:search-fill'
                : 'iconamoon:search'
            }
            fontSize={24}
            color={pathname === '/search' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/search' ? 'ui-text-head-3' : 'ui-text-caption'}`}
          >
            검색
          </span>
        </Link> */}
        <Link
          href='/customized'
          className={`${LinkClassName} ${pathname === '/customized' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/customized'
                ? 'mingcute:target-fill'
                : 'mingcute:target-line'
            }
            fontSize={24}
            color={pathname === '/customized' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/customized' ? 'ui-text-head-3' : 'ui-text-caption'}`}
          >
            맞춤축제
          </span>
        </Link>
      </div>
    </div>
  );
}
