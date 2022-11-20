/**
 * axios interceptors 관련 코드
 *
 * [주의!!! 메모리릭]
 * instance.interceptors.response 인터셉터
 * return response; 꼭 해주어야 한다.
 *
 * instance.interceptors.request 인터셉터
 * return axiosConfig; 꼭 해주여야 한다.
 */
import axios from 'axios';

import { API_TYPE, getAxiosConfig } from '../config';
import { TInterceptor, IApiParams, IApiConfig } from '../types';

/**
 * 로그
 * @param {AxiosInstance} instance : Axios 인스턴스
 * @param params : 옵션
 * @returns
 */
export const setErrorLoggerInterceptorResponse: TInterceptor = (instance, params: IApiParams = {}) => {
  //console.log('setErrorLoggerInterceptorResponse');

  instance.interceptors.response.use(
    (response: any) => response,
    (error: Error) => {
      try {
        if (axios.isAxiosError(error)) {
          if (error.config.url) {
            // ...
          }
        }
      } catch (error: any) {
        // ...
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

/**
 * Axios Config
 */
export const setAxiosConfigInterceptorRequest: TInterceptor = (
  instance,
  { payload = {}, store = null }: IApiParams = {},
) => {
  //console.log('setAxiosConfigInterceptorRequest');

  // 필수값 확인
  if (!store) {
    return instance;
  }

  // interceptor
  instance.interceptors.request.use((axiosConfig: IApiConfig) => {
    if (!store) {
      return axiosConfig;
    }

    const state = store?.getState() || {}; // 현 시점의 스토어 상태값 가져오기
    const config = getAxiosConfig(API_TYPE.DEFAULT, { state });
    //console.log('axios > interceptors > request > config!!!!!', config);

    return {
      ...axiosConfig,
      ...config,
      headers: {
        ...axiosConfig.headers,
        ...config.headers,
      },
    };
  });

  return instance;
};
