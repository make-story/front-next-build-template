// @index('./**/*.ts', f => `export { default as ${f.name} } from '${f.path}';`)
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IApiConfig, IApiPayload, IApiParams, TInterceptor } from '../types';

/**
 * Axios 인스턴스여부 확인 (타입가드)
 * @param value
 * @returns
 */
export function isAxiosInstance(value: any): value is AxiosInstance {
  return typeof (value as AxiosInstance)?.interceptors?.request?.use === 'function';
}

/**
 * axios 인스턴스 생성
 */
export const createAxiosInstance = (config?: IApiConfig): AxiosInstance => {
  const instance = axios.create({
    // axios config 공통 설정
    ...config,
    headers: {
      ...config?.headers,
    },
  });
  return instance;
};

/**
 * axios 인스턴스에 config 주입
 */
export const applyAxiosConfig = (instance: AxiosInstance, config?: IApiConfig) => {
  if (isAxiosInstance(instance) && config) {
    Object.assign(instance.defaults, {
      ...instance.defaults,
      ...config,
      headers: {
        ...instance.defaults.headers,
        ...config?.headers,
      },
    });
  }
};

/**
 * axios 인스턴스에 interceptor 추가 (주의! interceptor 는 실행할 때마다 콜백함수 계속 추가됨, axios 내부적으로 콜백에 계속 쌓일 수 있음)
 */
export function applyAxiosInterceptor(instance: AxiosInstance, interceptors: TInterceptor[], params: IApiParams = {}) {
  if (isAxiosInstance(instance)) {
    interceptors.forEach(interceptor => interceptor(instance, params));
  }
}
