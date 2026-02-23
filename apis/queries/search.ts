import { queryOptions } from '@tanstack/react-query';

import { getTopKeywords } from '../SWYP10BackendAPI';
import { queryKeyNamespaces } from './_namespaces';

const queryKeys = {
  topKeywords: (limit: number) => [
    queryKeyNamespaces.search,
    'topKeywords',
    limit,
  ],
};

export const topKeyWords = (limit: number) =>
  queryOptions({
    queryKey: queryKeys.topKeywords(limit),
    queryFn: () => getTopKeywords({ limit }),
  });
