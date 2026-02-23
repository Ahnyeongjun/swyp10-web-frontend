'use client';

import { useRef } from 'react';

/**
 * Dom이 특정 뷰포트 안에 들어온 것을 추적하기 위한 intersection observer Hook
 * 참조: https://velog.io/@jsi06138/React-Intersection-Observer-API%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
 * @param callback {function}
 * @return [observe, unobserve]
 * */
export const useInView = (
  callback: (isObserved: boolean) => void,
  threshold?: number,
) => {
  if (typeof window === 'undefined')
    return [() => console.log(''), () => console.log('')];

  const observer = useRef(
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(true);
          } else {
            callback(false);
          }
        });
      },
      { threshold: threshold ? threshold : 1 },
    ),
  );

  const observe = (element: HTMLElement) => {
    observer.current.observe(element);
  };

  const unobserve = (element: HTMLElement) => {
    observer.current.unobserve(element);
  };

  return [observe, unobserve];
};
