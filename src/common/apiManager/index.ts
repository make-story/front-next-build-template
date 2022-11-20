/**
 * apiManager
 * axios 각 영역별 인스턴스 생성
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { isAxiosInstance, createAxiosInstance, applyAxiosConfig, applyAxiosInterceptor } from './utils';
import { setErrorLoggerInterceptorResponse, setAxiosConfigInterceptorRequest } from './interceptors';
import { IApiParams } from './types';
import { API_TYPE, getAxiosConfig } from './config';

export * from './utils';

/**
 * API 별 인스턴스
 *
 * API 종류별 호출경로: http://wiki-digit.amorepacific.com:8090/pages/viewpage.action?pageId=103852400
 */
export const single = (type: string, params: IApiParams = {}) => {
  // config
  applyAxiosConfig(axios, getAxiosConfig(type, params));

  // 인터셉터
  applyAxiosInterceptor(axios, [setErrorLoggerInterceptorResponse, setAxiosConfigInterceptorRequest], params);

  //console.log('single instance', axios);
  return axios;
};
export const api = (params: IApiParams = {}) => {
  // 인스턴스
  const instance = createAxiosInstance(getAxiosConfig(API_TYPE.API, params));

  // 인터셉터
  applyAxiosInterceptor(instance, [setErrorLoggerInterceptorResponse, setAxiosConfigInterceptorRequest], params);

  //console.log('api instance', instance);
  return instance;
};

/**
 * auth
 */
export const apiAuth = (params: IApiParams = {}) => {
  // 인스턴스
  const instance = createAxiosInstance(getAxiosConfig(API_TYPE.API_AUTH, params));

  // 인터셉터
  applyAxiosInterceptor(instance, [setErrorLoggerInterceptorResponse], params);

  //console.log('apiAuth instance', instance);
  return instance;
};

/**
 * 모든 영역 API 인스턴스 한번에 생성
 */
export const createApiManager = (params: IApiParams = {}) => {
  //console.log('createApiManager', config);

  // 각 API 별 axios 인스턴스 생성, config 설정, 인터셉터 주입
  return {
    // 기본 API 호출 인스턴스
    api: api(params),
  } as const;
};
export type TApiManager = ReturnType<typeof createApiManager>;
