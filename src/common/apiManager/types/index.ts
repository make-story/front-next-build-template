import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Action, AnyAction, Store } from 'redux';
import { TApiManager } from '../index';

// axios 인스턴스에 config 주입
export interface IApiConfig extends AxiosRequestConfig {
  headers?: {
    'X-G1ECP-Channel'?: string;
    'X-G1ECP-CartNonmemberKey'?: string;
    Authorization?: string;
  };
}

// payload 파라미터 (추가 옵션)
export interface IApiPayload {
  channel?: string;
}

// API 파라미터
export interface IApiParams {
  config?: IApiConfig; // axios config
  payload?: IApiPayload; // 추가 파라미터
  store?: Store | null; // 스토어
  state?: any; // 스토어 상태
  dispatch?: any;
}

// 인터셉터
export type TInterceptor = (instance: AxiosInstance, params?: IApiParams) => void;

export type TActionWithApiManager<A extends Action = AnyAction> = A & {
  apiManager: TApiManager;
};
