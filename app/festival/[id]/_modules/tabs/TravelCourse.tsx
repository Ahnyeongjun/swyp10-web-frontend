'use client';

import { use } from 'react';

import { useQuery } from '@tanstack/react-query';
import 'swiper/css';

import { festivalTravelCourses } from '@/apis/queries';

import PlaceSlider from '../PlaceSlider';

interface Props {
  params: Promise<{ id: string }>;
}

export default function TravelCourse({ params }: Props) {
  const { id } = use(params);
  const festivalId = Number(id);

  const { data } = useQuery(festivalTravelCourses(festivalId));
  const courses = data?.data?.courses ?? [];
  const nearby = data?.data?.nearbyAttractions ?? [];

  const nearbyPlaces = nearby
    .map(p => ({
      name: p?.name ?? '장소',
      // 서버에서 거리 제공이 없으면 빈 문자열 표시
      distance: '',
      image: p?.thumbnail ?? 'https://picsum.photos/300/300?random=1',
    }))
    .slice(0, 10);

  const travelCourse = courses
    .map((c, idx) => ({
      number: idx + 1,
      name: c?.title ?? '코스',
      time: c?.time ?? '',
    }))
    .slice(0, 10);

  const isEmpty = nearbyPlaces.length === 0 && travelCourse.length === 0;

  return (
    <div className='space-y-6'>
      {isEmpty && (
        <div className='flex h-40 items-center justify-center rounded bg-[#f8f9fb]'>
          <p className='ui-text-body-2 ui-text-color-sub'>
            표시할 여행 코스 정보가 없어요
          </p>
        </div>
      )}

      {/* 근처 볼 거리 */}
      {nearbyPlaces.length > 0 && (
        <div>
          <h3 className='mb-3 text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
            근처 볼 거리
          </h3>
          <PlaceSlider places={nearbyPlaces} />
        </div>
      )}

      {/* 추천 여행 코스 */}
      {travelCourse.length > 0 && (
        <div>
          <h3 className='mb-3 text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
            추천 여행 코스
          </h3>
          <div className='w-[162px]'>
            {travelCourse.map((course, index) => (
              <div key={index}>
                <div className='flex items-center gap-3'>
                  <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[15px] bg-[#f1f2f4] px-[11px]'>
                    <span className='text-[14px] leading-[20px] font-semibold tracking-[-0.14px] text-[#5e6573]'>
                      {course.number}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-[16px] leading-[22px] font-bold tracking-[-0.16px] whitespace-nowrap text-[#090a0c]'>
                      {course.name}
                    </span>
                    <span className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] whitespace-nowrap text-[#5e6573]'>
                      {course.time}
                    </span>
                  </div>
                </div>
                {index < travelCourse.length - 1 && (
                  <div className='relative my-0 ml-0 h-11 w-5'>
                    <svg
                      width='20'
                      height='44'
                      viewBox='0 0 20 44'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M10 0V44'
                        stroke='#E5E7EB'
                        strokeWidth='2'
                        strokeDasharray='4 4'
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
