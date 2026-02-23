import { queryOptions } from '@tanstack/react-query';

import * as api from '../SWYP10BackendAPI';
import { queryKeyNamespaces } from './_namespaces';

const queryKeys = {
  festivalDetail: (festivalId: number) => [
    queryKeyNamespaces.festival,
    festivalId,
    'detail',
  ],
  travelCourses: (festivalId: number) => [
    queryKeyNamespaces.festival,
    festivalId,
    'travel-courses',
  ],
  restaurants: (festivalId: number) => [
    queryKeyNamespaces.festival,
    festivalId,
    'restaurants',
  ],
};

export const festivalDetail = (festivalId: number) =>
  queryOptions({
    queryKey: queryKeys.festivalDetail(festivalId),
    queryFn: () => api.getFestivalDetail(festivalId),
  });

export const festivalTravelCourses = (festivalId: number) =>
  queryOptions({
    queryKey: queryKeys.travelCourses(festivalId),
    queryFn: () => api.getFestivalTravelCourses(festivalId),
  });

export const festivalRestaurants = (festivalId: number) =>
  queryOptions({
    queryKey: queryKeys.restaurants(festivalId),
    queryFn: () => api.getFestivalRestaurants(festivalId),
  });
