export * from './map';

// HTTP 클라이언트 옵션 타입
export interface HttpClientOptions {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number; // 커스텀 타임아웃 설정 (밀리초)
}
