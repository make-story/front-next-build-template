/**
 * axios config 관련 코드
 */
import { IApiConfig, IApiPayload, IApiParams, TInterceptor } from '../types';

// 각 API별 구분 값
export const API_TYPE = {
  DEFAULT: 'DEFAULT',
  API: 'API',
  API_AUTH: 'API_AUTH',
};

// axios 기본 설정 값
const axiosDefaults = {
  headers: {
    'Content-Type': 'application/json; charset=utf8',
    'Accept-Language': 'ko',
  },
  //withCredentials: true, // 쿠키포함 (origin 다른 통신) - 서버단 'Access-Control-Allow-Credentials : true' 설정 필요, 'Access-Control-Allow-Origin : "*"' 경우 에러발생
  timeout: 10000,
};

// 각 영역별 설정 값 반환
export const getAxiosConfig = (type: string, { config = {}, store = null, state = null }: IApiParams) => {
  // 기본값
  config = {
    ...axiosDefaults,
    ...config,
    headers: {
      ...axiosDefaults.headers,
      ...config.headers,
    },
  };

  // state
  if (store) {
    state = store?.getState();
  }
  if (state) {
    const { channel = '' } = state?.agent || {};
    const headers: any = {};

    // 사용자 접근 채널 (MobileWeb, MobileApp, PCWeb)
    if (channel) {
      headers['X-G1ECP-Channel'] = channel;
    }

    config = {
      ...config,
      headers: {
        ...config.headers,
        ...headers,
      },
    };
  }

  // 각 영역별
  switch (type) {
    // api
    case API_TYPE.API:
      return {
        baseURL: '/',
        ...config,
      };

    // auth agent
    case API_TYPE.API_AUTH:
      return {
        baseURL: '/auth',
        ...config,
      };

    // 기본 설정
    case API_TYPE.DEFAULT:
    default:
      return config;
  }
};
