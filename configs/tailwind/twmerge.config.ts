import { extendTailwindMerge } from 'tailwind-merge';

// NOTE: globals.css에서 커스텀 클래스 사용 시, 해당 클래스를 twMerge의 입력으로 넣는 경우, 해당 설정이 반드시 필요
// 빌드타임-런타임 간의 격차가 있기 때문에 동적 동기화하는 방법이 없음. 수동으로 상수로 관리하며 동기화 필요.
const UI_TYPOGRAPHY_CLASSES = [
  'ui-text-head',
  'ui-text-head-2',
  'ui-text-sub-head',
  'ui-text-sub-head-2',
  'ui-text-sub-head-3',
  'ui-text-body',
  'ui-text-body-2',
  'ui-text-body-2-long',
  'ui-text-caption',
];

const UI_TEXT_COLOR_CLASSES = [
  'ui-text-color-sub',
  'ui-text-color-info',
  'ui-text-color-disabled',
  'ui-text-color-error',
];

const UI_BORDER_CLASSES = [
  'ui-border-divider',
  'ui-border-basic',
  'ui-border-active',
  'ui-border-error',
];

const UI_BG_COLOR_CLASSES = ['ui-bg-mark'];

// NOTE: 성능 상 extend 호출은 한 번만 해서 캐싱하는 게 중요함
// The function extendTailwindMerge computes a large data structure based on the config passed to it.
// I recommend to call it only once and store the result in a top-level variable instead of calling it inline within another repeatedly called function.
// @see https://github.com/dcastil/tailwind-merge/blob/v3.3.1/docs/api-reference.md#extendtailwindmerge
export const customTwMerge = extendTailwindMerge({
  // ↓ Optional config extensions
  //   Follows same shape as the `override` object.
  extend: {
    // ↓ Class groups to extend or create
    classGroups: {
      'font-size': UI_TYPOGRAPHY_CLASSES,
      leading: UI_TYPOGRAPHY_CLASSES,
      'font-weight': UI_TYPOGRAPHY_CLASSES,
      tracking: UI_TYPOGRAPHY_CLASSES,
      'text-color': UI_TEXT_COLOR_CLASSES,
      'border-w': UI_BORDER_CLASSES,
      'border-color': UI_BORDER_CLASSES,
      'bg-color': UI_BG_COLOR_CLASSES,
    },
  },
});
