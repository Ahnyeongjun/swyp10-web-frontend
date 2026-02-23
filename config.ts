const config = {
  kakao: {
    // uri: process.env.NEXT_PUBLIC_KAKAO_URI,
    redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    rest_api_key: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
  },
  naver: {
    map_client_id: process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID,
  },
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  base_url: process.env.NEXT_PUBLIC_BASE_URL,
};

export default config;
