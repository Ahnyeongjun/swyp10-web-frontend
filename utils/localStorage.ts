import { FestivalSummaryResponse } from '@/apis/SWYP10BackendAPI.schemas';

// 설문 결과 데이터 타입
export interface SurveyResultData {
  type: string;
  timestamp: number;
  festivals?: FestivalSummaryResponse[];
}

// localStorage 키 상수
const SURVEY_RESULT_KEY = 'chukjibeop_survey_result';

/**
 * 설문 결과를 localStorage에 저장 (로그인 사용자만)
 */
export function saveSurveyResult(
  resultData: SurveyResultData,
  isLoggedIn: boolean,
): void {
  try {
    if (typeof window !== 'undefined' && isLoggedIn) {
      localStorage.setItem(SURVEY_RESULT_KEY, JSON.stringify(resultData));
    }
  } catch (error) {
    console.error('Failed to save survey result:', error);
  }
}

/**
 * localStorage에서 설문 결과 불러오기 (로그인 사용자만)
 */
export function getSurveyResult(isLoggedIn: boolean): SurveyResultData | null {
  try {
    if (typeof window !== 'undefined' && isLoggedIn) {
      const saved = localStorage.getItem(SURVEY_RESULT_KEY);

      return saved ? JSON.parse(saved) : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to get survey result:', error);
    return null;
  }
}

/**
 * localStorage에서 설문 결과 삭제
 */
export function clearSurveyResult(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SURVEY_RESULT_KEY);
    }
  } catch (error) {
    console.error('Failed to clear survey result:', error);
  }
}

/**
 * 설문 결과가 존재하는지 확인 (로그인 사용자만)
 */
export function hasSurveyResult(isLoggedIn: boolean): boolean {
  return getSurveyResult(isLoggedIn) !== null;
}
