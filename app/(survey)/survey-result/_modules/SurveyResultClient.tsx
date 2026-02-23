'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { getFestivalsForPersonalTest } from '@/apis/SWYP10BackendAPI';
import type {
  FestivalSummaryResponse,
  GetFestivalsForPersonalTestPersonalityType,
} from '@/apis/SWYP10BackendAPI.schemas';
import adventurerImage from '@/assets/images/festival-recommendation/adventurer.png';
import curatorImage from '@/assets/images/festival-recommendation/curator.png';
import energizerImage from '@/assets/images/festival-recommendation/energizer.png';
import healerImage from '@/assets/images/festival-recommendation/healer.png';
import socializerImage from '@/assets/images/festival-recommendation/socializer.png';
import HorizontalFestivalList from '@/components/HorizontalFestivalList';
import { useAuth } from '@/hooks/useAuth';
import { useShareThisPage } from '@/hooks/useShareThisPage';
import {
  clearSurveyResult,
  getSurveyResult,
  saveSurveyResult,
} from '@/utils/localStorage';

// 결과별 이미지 매핑
const resultImages = {
  ENERGIZER: energizerImage,
  CURATOR: curatorImage,
  EXPLORER: adventurerImage,
  SOCIALIZER: socializerImage,
  HEALER: healerImage,
};

// 결과 데이터 타입
interface SurveyResult {
  type: string;
  title: string;
  description: string;
  traits: string[];
  longDescription: string;
}

// 결과 데이터
const surveyResults: Record<string, SurveyResult> = {
  ENERGIZER: {
    type: 'ENERGIZER',
    title: '축제 에너자이저',
    description: '축제장이 당신을 기다려요!',
    traits: ['활기찬', '사교적인', '적극적인'],
    longDescription:
      '활기차고 사교적인 당신은 축제의 중심에서 빛나는 존재입니다. 큰 무대, 많은 사람들, 뜨거운 열기 속에서 진짜 행복을 느끼죠. 당신이 있는 곳이 바로 파티가 시작되는 곳!',
  },
  CURATOR: {
    type: 'CURATOR',
    title: '축제 큐레이터',
    description: '완벽한 축제 경험을 설계하는 당신',
    traits: ['계획적인', '꼼꼼한', '완벽주의'],
    longDescription:
      '꼼꼼하고 계획적인 당신은 완벽한 축제 경험을 설계하는 큐레이터입니다. 모든 세부사항을 놓치지 않고, 의미 있는 문화 경험을 추구하죠. 당신의 축제는 예술 작품처럼 완벽합니다!',
  },
  EXPLORER: {
    type: 'EXPLORER',
    title: '문화 탐험가',
    description: '깊이 있는 문화가 당신을 부릅니다',
    traits: ['탐험적인', '호기심 많은', '깊이 있는'],
    longDescription:
      '호기심 많고 탐험적인 당신은 문화의 깊이를 탐구하는 모험가입니다. 전통과 역사의 의미를 찾아 떠나는 여행에서 진정한 보물을 발견하죠. 당신의 축제는 문화의 진수를 담고 있습니다!',
  },
  SOCIALIZER: {
    type: 'SOCIALIZER',
    title: '축제 소셜라이저',
    description: '친구들과의 즐거운 시간이 최고!',
    traits: ['사교적인', '친근한', '협력적인'],
    longDescription:
      '사교적이고 친근한 당신은 사람들과의 연결을 중시하는 소셜라이저입니다. 친구들과 함께하는 즐거운 시간, 공유하는 순간들이 가장 소중하죠. 당신의 축제는 따뜻한 인연으로 가득합니다!',
  },
  HEALER: {
    type: 'HEALER',
    title: '축제 힐러',
    description: '자연스럽고 여유로운 힐링이 필요해요',
    traits: ['평화로운', '여유로운', '힐링하는'],
    longDescription:
      '평화롭고 여유로운 당신은 자연과 조화를 이루는 힐러입니다. 조용하고 아늑한 분위기에서 진정한 휴식을 찾고, 마음의 평화를 추구하죠. 당신의 축제는 마음을 치유하는 힐링 공간입니다!',
  },
};

// 메인 결과 페이지 컴포넌트
export function SurveyResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isShared = searchParams.get('shared');

  const [festivals, setFestivals] = useState<FestivalSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { share } = useShareThisPage();
  const { isLoggedIn } = useAuth();

  const handleRetakeTest = () => {
    // 다시 테스트할 때는 기존 결과 삭제
    clearSurveyResult();
    router.push('/survey');
  };

  const handleFestivalClick = (festival: { id: string }) => {
    router.push(`/festival/${festival.id}`);
  };

  // URL 파라미터에서 결과 타입을 가져와서 해당 결과 반환
  const getResultFromType = () => {
    const type = searchParams.get('type');

    if (type && surveyResults[type]) {
      return surveyResults[type];
    }

    // 기본값으로 HEALER 반환
    return surveyResults['HEALER'];
  };

  // 맞춤 축제 데이터 가져오기
  const fetchPersonalizedFestivals = async (
    personalityType: GetFestivalsForPersonalTestPersonalityType,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFestivalsForPersonalTest({
        personalityType,
        size: 10,
      });

      if (response.success && response.data?.content) {
        setFestivals(response.data.content);

        // 로그인된 사용자만 결과를 localStorage에 저장
        if (isLoggedIn) {
          const resultData = {
            type: personalityType || 'HEALER', // fallback to HEALER if null
            timestamp: Date.now(),
            festivals: response.data.content,
          };
          saveSurveyResult(resultData, true);
        }
      } else {
        setError('축제 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch personalized festivals:', err);
      setError('축제 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 로그인된 사용자만 localStorage에서 저장된 결과 확인
    if (isLoggedIn) {
      const savedResult = getSurveyResult(true);

      if (savedResult && savedResult.festivals) {
        // 저장된 데이터가 있으면 API 호출 없이 바로 사용
        setFestivals(savedResult.festivals);
        setLoading(false);
        return;
      }
    }

    // 저장된 데이터가 없거나 로그인되지 않은 경우 API 호출
    const result = getResultFromType();
    if (result.type) {
      fetchPersonalizedFestivals(
        result.type as GetFestivalsForPersonalTestPersonalityType,
      );
    }
  }, [searchParams, isLoggedIn]);

  // API 응답을 HorizontalFestivalList용 형태로 변환
  const transformFestivalsData = (apiData: FestivalSummaryResponse[]) => {
    return apiData.map(festival => ({
      id: String(festival.id || ''),
      image: festival.thumbnail || 'https://picsum.photos/140/140',
      theme: festival.theme || '기타',
      title: festival.title || '축제명',
      location: festival.address || '위치 정보 없음',
      isMarked: festival.bookmarked || false,
    }));
  };

  const result = getResultFromType();
  const resultKey = result.type;
  const resultImage =
    resultImages[resultKey as keyof typeof resultImages] || resultImages.HEALER;

  const recommendedFestivals = transformFestivalsData(festivals);

  return (
    <div className='relative min-h-screen w-full bg-[#ffffff] pb-[100px]'>
      {/* Content */}
      <div className='flex flex-col items-center gap-7'>
        {/* Result Header */}
        <div className='flex flex-col items-center gap-3'>
          <div className='flex w-full flex-col items-center gap-1 text-center'>
            <p className='text-[16px] leading-[22px] font-medium tracking-[-0.16px] text-[#5e6573]'>
              나에게 맞는 축제는
            </p>
            <h1 className='text-[24px] leading-[34px] font-bold tracking-[-0.24px] text-[#090a0c]'>
              {result.title}
            </h1>
          </div>

          {/* Character Traits */}
          <div className='flex flex-row items-center justify-center gap-[5px]'>
            {result.traits.map((trait, index) => (
              <div
                key={index}
                className='flex flex-row items-center justify-center gap-0.5 rounded-[100px] bg-[#f1f2f4] px-2 py-1'
              >
                <span className='text-center text-[14px] leading-[20px] font-semibold tracking-[-0.14px] whitespace-pre text-[#26282e]'>
                  {trait}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Result Image */}
        <div className='h-[300px] w-[214px] bg-cover bg-center bg-no-repeat'>
          <Image
            src={resultImage}
            alt={result.title}
            width={214}
            height={300}
            className='h-full w-full object-cover'
            priority
          />
        </div>

        {/* Result Description */}
        <div className='flex w-full flex-col items-start gap-2 text-center'>
          <h2 className='w-full text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
            {result.description}
          </h2>
          <p className='w-full text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#26282e]'>
            {result.longDescription}
          </p>
        </div>

        {/* Recommended Festivals Section */}
        <div className='w-full'>
          {loading ? (
            <div className='flex flex-col gap-4'>
              <h2 className='text-lg font-bold text-[#090a0c]'>
                나의 맞춤 축제
              </h2>
              <div className='flex items-center justify-center py-8'>
                <div className='text-sm text-gray-500'>
                  축제를 불러오는 중...
                </div>
              </div>
            </div>
          ) : error ? (
            <div className='flex flex-col gap-4'>
              <h2 className='text-lg font-bold text-[#090a0c]'>
                나의 맞춤 축제
              </h2>
              <div className='flex items-center justify-center py-8'>
                <div className='text-sm text-red-500'>{error}</div>
              </div>
            </div>
          ) : recommendedFestivals.length === 0 ? (
            <div className='flex flex-col gap-4'>
              <h2 className='text-lg font-bold text-[#090a0c]'>
                나의 맞춤 축제
              </h2>
              <div className='flex items-center justify-center py-8'>
                <div className='text-sm text-gray-500'>
                  현재 추천할 수 있는 축제가 없습니다.
                </div>
              </div>
            </div>
          ) : (
            <HorizontalFestivalList
              festivals={recommendedFestivals}
              onFestivalClick={handleFestivalClick}
            />
          )}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      {!isShared && (
        <div className='fixed bottom-0 left-1/2 w-full max-w-[600px] -translate-x-1/2 bg-transparent px-5 py-4'>
          <div className='flex gap-3'>
            <button
              onClick={handleRetakeTest}
              className='h-12 flex-1 rounded-lg border border-[#d5d7db] bg-white text-sm font-medium text-[#090a0c]'
            >
              다시 테스트하기
            </button>
            <button
              onClick={share}
              className='h-12 flex-1 rounded-lg bg-[#090a0c] text-sm font-medium text-white'
            >
              결과 공유
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
