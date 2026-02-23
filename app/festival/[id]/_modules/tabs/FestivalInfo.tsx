import { Icon } from '@iconify/react';

import FestivalImageSlider from '../FestivalImageSlider';

interface FestivalInfoProps {
  festivalImages: string[];
  overview: string | null | undefined;
  phone: string | null | undefined;
  fee: string | null | undefined;
  homepage: string | null | undefined;
  eventPlace: string | null | undefined;
  discountInfo: string | null | undefined;
  spendTime: string | null | undefined;
}

export default function FestivalInfo({
  festivalImages,
  overview,
  phone,
  fee,
  homepage,
  eventPlace,
  discountInfo,
  spendTime,
}: FestivalInfoProps) {
  console.log('discountInfo:::', discountInfo);
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3'>
        <h3 className='ui-text-sub-head text-black'>축제 소개</h3>
        <FestivalImageSlider images={festivalImages} />
        <p className='ui-text-body-2-long ui-text-color-sub'>
          {overview ?? '소개 정보가 없습니다.'}
        </p>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='ui-text-sub-head text-black'>행사내용</h3>
        <div className='space-y-4 ui-text-body-2-long ui-text-color-sub'>
          <p>
            1. 행사 장소
            <br />- {eventPlace ? eventPlace : '행사 장소 정보 없음'}
          </p>

          <p>
            2. 할인 정보
            <br />- {discountInfo ? discountInfo : '할인 정보 없음'}
          </p>

          <p>
            3. 소요 시간
            <br />- {spendTime ? spendTime : '소요 시간 정보 없음'}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='ui-text-sub-head text-black'>상세 정보</h3>
        <div className='flex w-80 flex-col gap-3'>
          <div className='flex items-start gap-2'>
            <Icon
              icon='fluent:call-20-filled'
              className='text-gray-300'
              fontSize={20}
            />
            <span className='ui-text-body-2 ui-text-color-sub'>
              {phone ?? '연락처 정보 없음'}
            </span>
          </div>
          <div className='flex w-full items-start gap-2'>
            <Icon
              icon='tabler:coin-filled'
              className='text-gray-300'
              fontSize={20}
            />
            <span className='ui-text-body-2 ui-text-color-sub'>
              {fee ?? '요금 정보 없음'}
            </span>
          </div>
          <div className='flex w-full items-start gap-2'>
            <Icon
              icon='gravity-ui:link'
              className='text-gray-300'
              fontSize={20}
            />
            <div className='w-[296px]'>
              <p className='ui-text-body-2 leading-[20px] break-all ui-text-color-sub'>
                {homepage ?? '홈페이지 정보 없음'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
