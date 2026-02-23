'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button';

// 성향 점수 타입
interface PersonalityScores {
  활동적: number;
  사교적: number;
  전통적: number;
  현대적: number;
  조용한: number;
  계획적: number;
}

// 설문 질문 데이터 타입
interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
    subtitle: string;
    scores: PersonalityScores;
  }[];
}

// 설문 질문 데이터
const surveyQuestions: Question[] = [
  {
    id: 1,
    title: '주말에 가장 하고 싶은 활동은?',
    subtitle: '어떤 주말을 보내고 싶나요?',
    options: [
      {
        id: '1-1',
        title: '전통 박물관 / 역사 체험',
        subtitle: '우리 역사 및 전통문화를 체험',
        scores: {
          전통적: 3,
          조용한: 2,
          활동적: 0,
          사교적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '1-2',
        title: '지역 음식 탐방과 요리 체험',
        subtitle: '새로운 맛과 음식 경험',
        scores: {
          현대적: 2,
          사교적: 2,
          활동적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '1-3',
        title: '라이브 음악 공연 관람',
        subtitle: '생생한 음악과 함께하는 시간',
        scores: {
          현대적: 3,
          활동적: 2,
          사교적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '1-4',
        title: '자연 속에서 산책하기',
        subtitle: '힐링하는 자역속에 여유',
        scores: {
          조용한: 3,
          계획적: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
        },
      },
    ],
  },
  {
    id: 2,
    title: '축제는 누구랑 즐기고 싶나요?',
    subtitle: '당신의 축제 동반자를 선택해주세요',
    options: [
      {
        id: '2-1',
        title: '혼자서 조용히 즐기기',
        subtitle: '나만의 시간을 보내고 싶음',
        scores: {
          조용한: 3,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '2-2',
        title: '가족과 함께',
        subtitle: '혼 가족이 함께 즐기기',
        scores: {
          사교적: 2,
          계획적: 2,
          활동적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
        },
      },
      {
        id: '2-3',
        title: '연인과 로맨틱하게',
        subtitle: '특별한 사람과 특별한 시간을 ',
        scores: {
          사교적: 1,
          현대적: 2,
          활동적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '2-4',
        title: '친구들과 왁자지껄',
        subtitle: '친구들과 신나게 놀고 싶어요',
        scores: {
          사교적: 3,
          활동적: 1,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
    ],
  },
  {
    id: 3,
    title: '어떤 규모의 축제를 선호하시나요?',
    subtitle: '축제의 크기와 분위기를 선택해주세요.',
    options: [
      {
        id: '3-1',
        title: '대형 축제',
        subtitle: '수만명이 모이는 큰 축제',
        scores: {
          활동적: 3,
          사교적: 3,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '3-2',
        title: '중형 축제',
        subtitle: '적당한 규모의 지역 축제',
        scores: {
          활동적: 2,
          사교적: 2,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '3-3',
        title: '소형 축제',
        subtitle: '아늑하고 소규모인 축제',
        scores: {
          활동적: 1,
          사교적: 1,
          조용한: 2,
          전통적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '3-4',
        title: '상관없어요',
        subtitle: '규모보다는 내용이 중요해요',
        scores: {
          활동적: 2,
          사교적: 1,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
    ],
  },
  {
    id: 4,
    title: '축제를 어떻게 즐기고 싶나요?',
    subtitle: '축제 참여 방식을 선택해주세요.',
    options: [
      {
        id: '4-1',
        title: '적극적으로 참여',
        subtitle: '체험, 게임, 이벤트 모두 참여할래요!',
        scores: {
          활동적: 3,
          사교적: 2,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '4-2',
        title: '선택적으로 참여',
        subtitle: '관심 있는 것만 골라서 참여',
        scores: {
          활동적: 2,
          계획적: 2,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
        },
      },
      {
        id: '4-3',
        title: '주로 관람',
        subtitle: '보고 듣고 감사하는 것을 좋아함',
        scores: {
          조용한: 3,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '4-4',
        title: '사진/영상 촬영',
        subtitle: '기록하고 공유하는 것을 좋아함',
        scores: {
          조용한: 2,
          계획적: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
        },
      },
    ],
  },
  {
    id: 5,
    title: '축제는 여행까지 고려하고 있나요?',
    subtitle: '축제 뿐만 아닌, 여행까지 계획하나요?',
    options: [
      {
        id: '5-1',
        title: '당일치기',
        subtitle: '축제만 가볍게 즐기고 싶어요',
        scores: {
          활동적: 1,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '5-2',
        title: '1박 2일',
        subtitle: '하루 더 머물며 여유롭게',
        scores: {
          계획적: 2,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
        },
      },
      {
        id: '5-3',
        title: '2박 3일 이상',
        subtitle: '충분한 시간을 두고 깊이 있게',
        scores: {
          계획적: 3,
          조용한: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
        },
      },
      {
        id: '5-4',
        title: '상황에 따라',
        subtitle: '축제 내용에 따라 유동적으로',
        scores: {
          현대적: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
    ],
  },
];

// 진행바 컴포넌트
function ProgressBar({ currentStep }: { currentStep: number }) {
  const progress = (currentStep / 5) * 100;

  return (
    <div className='h-1 overflow-clip rounded-[100px] bg-[#f1f2f4]'>
      <div
        className='h-1 rounded-[100px] bg-[#ff8757] transition-all duration-300 ease-in-out'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// 선택지 컴포넌트
function ChoiceOption({
  option,
  isSelected,
  onSelect,
}: {
  option: { id: string; title: string; subtitle: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`cursor-pointer rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-[#5e6573] bg-[#f1f2f4]'
          : 'border-[#d5d7db] bg-[#ffffff]'
      } border`}
      onClick={onSelect}
    >
      <div className='flex flex-col items-center justify-center gap-1 py-4 text-center'>
        <div
          className={`shrink-0 text-[16px] tracking-[-0.16px] ${
            isSelected
              ? 'font-bold text-[#090a0c]'
              : 'font-medium text-[#26282e]'
          }`}
        >
          <p className='leading-[22px]'>{option.title}</p>
        </div>
        <div
          className={`shrink-0 text-[14px] tracking-[-0.14px] ${
            isSelected ? 'text-[#868c98]' : 'text-[#5e6573]'
          }`}
        >
          <p className='leading-[20px]'>{option.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// 메인 설문 조사 컴포넌트
export function SurveyPageClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >({});

  const currentQuestion = surveyQuestions.find(q => q.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;
  const hasSelection = selectedOptions[currentStep];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep]: optionId,
    }));
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasSelection) {
      if (isLastStep) {
        // 설문 완료 후 분석중 페이지로 이동
        console.log('설문 완료:', selectedOptions);
        const resultType = calculateResult(selectedOptions);
        router.push(`/survey-analyzing?type=${resultType}`);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // 결과 계산 함수
  const calculateResult = (surveyData: Record<number, string>): string => {
    const scores = {
      활동적: 0,
      사교적: 0,
      전통적: 0,
      현대적: 0,
      조용한: 0,
      계획적: 0,
    };

    // 각 질문의 선택된 답변에 따른 점수 누적
    Object.entries(surveyData).forEach(([questionId, answerId]) => {
      const questionNum = parseInt(questionId);
      const question = surveyQuestions.find(q => q.id === questionNum);
      if (question) {
        const selectedOption = question.options.find(
          opt => opt.id === answerId,
        );
        if (selectedOption) {
          Object.entries(selectedOption.scores).forEach(([trait, score]) => {
            scores[trait as keyof typeof scores] += score as number;
          });
        }
      }
    });

    // 결과 결정 로직 (API 타입에 맞게 수정)
    if (scores.활동적 >= 8 && scores.사교적 >= 6) {
      return 'ENERGIZER';
    } else if (scores.전통적 >= 3 && scores.조용한 >= 4) {
      return 'EXPLORER';
    } else if (scores.조용한 >= 8 && scores.계획적 >= 2) {
      return 'CURATOR';
    } else if (scores.사교적 >= 5) {
      return 'SOCIALIZER';
    } else {
      return 'HEALER'; // 기본값
    }
  };

  if (!currentQuestion) return null;

  return (
    <>
      <ProgressBar currentStep={currentStep} />
      <div className='flex w-full flex-col bg-white'>
        {/* Question Content */}
        <div className='box-border flex flex-col items-start justify-start gap-9 p-0 pt-6'>
          {/* Progress Text */}
          <div className='box-border flex shrink-0 flex-col items-start justify-start gap-2 p-0'>
            <div className='box-border flex shrink-0 flex-row items-start justify-start p-0 text-left text-[14px] leading-[0] tracking-[-0.14px] not-italic'>
              <div className='shrink-0 font-bold text-nowrap text-[#ff8757]'>
                <p className='leading-[1.4]'>{currentStep}</p>
              </div>
              <div className='h-5 shrink-0 font-medium text-[#5e6573]'>
                <p className='leading-[1.4]'>/5</p>
              </div>
            </div>

            {/* Question Title */}
            <div className='box-border flex w-full shrink-0 flex-col items-start justify-start gap-1 p-0 text-left leading-[0] not-italic'>
              <div className='w-full shrink-0 text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-[#090a0c]'>
                <p className='mb-0 block'>{currentQuestion.title}</p>
              </div>
              <div className='w-full shrink-0 text-[14px] font-medium tracking-[-0.14px] text-[#5e6573]'>
                <p className='block leading-[20px]'>
                  {currentQuestion.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className='box-border flex w-full flex-1 shrink-0 flex-col gap-3 p-0'>
            {currentQuestion.options.map(option => (
              <ChoiceOption
                key={option.id}
                option={option}
                isSelected={selectedOptions[currentStep] === option.id}
                onSelect={() => handleOptionSelect(option.id)}
              />
            ))}
          </div>
        </div>

        <div className='fixed bottom-0 left-1/2 box-border flex w-full max-w-[600px] -translate-x-1/2 flex-col justify-start gap-2.5 bg-[#ffffff] px-5 pt-4 pb-10'>
          <div className='box-border flex w-full shrink-0 flex-row items-start justify-start gap-2 p-0'>
            {/* Previous Button */}
            <Button
              onClick={handlePrevious}
              disabled={isFirstStep}
              variant={isFirstStep ? 'secondary' : 'secondary'}
              size='md'
              className='flex-1'
            >
              이전 질문
            </Button>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              disabled={!hasSelection}
              variant={hasSelection ? 'primary' : 'secondary'}
              size='md'
              className='flex-1'
            >
              {isLastStep ? '결과 보기' : '다음 질문'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
