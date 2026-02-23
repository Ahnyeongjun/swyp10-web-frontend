import type { SearchKeywordResponse } from '@/apis/SWYP10BackendAPI.schemas';

export interface TrendingItem {
  id: number;
  rank: number;
  keyword: string;
  isRising: boolean;
  count?: number;
}

export function transformApiDataToTrendingItems(
  apiData: SearchKeywordResponse[],
): TrendingItem[] {
  return apiData.map((item, index) => ({
    id: index + 1,
    rank: index + 1,
    keyword: item.keyword ?? '',
    isRising: index < 3,
    count: item.count,
  }));
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
}

export interface TrendingSearchItemProps {
  item: TrendingItem;
  onSearch: (keyword: string) => void;
}
