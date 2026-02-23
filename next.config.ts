import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // NOTE: 빌드 이전 직접 lint 실행
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: '175.45.195.169:8080/',
      },
      {
        protocol: 'http',
        hostname: 'tong.visitkorea.or.kr',
      },
      {
        protocol: 'https',
        hostname: 'chukjibeob.store',
      },
      { protocol: 'http', hostname: 'img1.kakaocdn.net' },
    ],
  },
  // NOTE: SVGR 설정 - @see https://react-svgr.com/docs/next/
  webpack(config) {
    // @ts-expect-error 타입 미지원
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
