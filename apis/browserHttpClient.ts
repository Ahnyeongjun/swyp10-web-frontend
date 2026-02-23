import axios, { InternalAxiosRequestConfig } from 'axios';

import config from '@/config';
import { API_TIMEOUT } from '@/constants';
import { HttpClientOptions } from '@/types';

import { CommonResponse } from './CommonResponse';

export const attachAccessToken = async (config: InternalAxiosRequestConfig) => {
  const accessToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
  console.log('accessToken found from cookie:', accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const baseURL = config.api.baseURL;
const instance = axios.create({
  baseURL: config.api.baseURL,
  timeout: API_TIMEOUT, // API 타임아웃 상수 사용
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // origin: config.base_url,
  },
});

instance.interceptors.request.use(attachAccessToken);

// 요청 로깅 인터셉터 추가
instance.interceptors.request.use(
  config => {
    console.log(' Request:', {
      method: config.method?.toUpperCase(),
      url: baseURL + (config.url ?? ''),
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// 응답 로깅 인터셉터 추가
instance.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    return Promise.reject(error);
  },
);

export const httpClient = async <T = unknown>({
  url,
  method,
  params,
  data,
  headers,
  timeout,
}: HttpClientOptions) => {
  // 커스텀 타임아웃이 설정되지 않은 경우 기본값 사용
  const requestTimeout = timeout || API_TIMEOUT;

  // AbortController를 사용하여 요청 취소 가능하도록 설정
  const abortController = new AbortController();

  // requestTimeout 후 자동으로 요청 취소
  const timeoutId = setTimeout(() => {
    abortController.abort();
    console.warn(
      `⚠️ API 요청이 ${requestTimeout / 1000}초를 초과하여 자동으로 취소되었습니다:`,
      url,
    );
  }, requestTimeout);

  try {
    const response = await instance({
      url,
      method,
      params,
      data,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      signal: abortController.signal,
    });

    // 요청이 성공적으로 완료되면 타임아웃 타이머 정리
    clearTimeout(timeoutId);

    return response.data as CommonResponse<T>;
  } catch (error) {
    // 타임아웃 타이머 정리
    clearTimeout(timeoutId);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('❌ API 요청 타임아웃:', url);
        throw new Error(`API 요청이 타임아웃되었습니다: ${url}`);
      }
      if (error.name === 'AbortError') {
        console.error('❌ API 요청이 취소되었습니다:', url);
        throw new Error(`API 요청이 취소되었습니다: ${url}`);
      }
    }

    throw error;
  }
};
