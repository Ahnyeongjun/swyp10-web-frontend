export default {
  extends: ['@commitlint/config-conventional'],
  /*
    type(scope?): subject
    body?
    footer?
  */
  // 0=off, 1=warn, 2=error
  // always=allow, never=disallow
  rules: {
    // [0] = 규칙 해제
    'subject-full-stop': [0], // 마침표 필수 사용 없음
    'header-max-length': [0], // 첫 줄 길이 제한 없음
    'subject-case': [0], // 첫 글자 대문자 제한 없음 (한글)
    'type-case': [0], // 대소문자 제한 없음 (한글)
    'subject-empty': [2, 'never'], // subject 생략 불가
    'type-empty': [2, 'never'], // type 생략 불가
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'wip'], // 이 타입들만 사용 가능
    ],
  },
};
