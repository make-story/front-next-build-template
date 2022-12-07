/**
 * 테스트
 */
import axios from 'axios';
import { delay, randomNumberInRange } from '@src/common/utils/index';

// test
export const fetchModuleTest = (params: any = {}) => {
  return axios
    .get('/dummy/module/index', {
      params: {
        // 사용자 값
        ...params,
      },
    })
    .then(response => ({ data: response?.data }))
    .catch(error => ({ error }));
};

// test
export const fetchModuleTest1 = (params: any = {}) => {
  return axios
    .get('/dummy/module/index')
    .then(({ config, data, status }) => data)
    .catch(error => {
      throw error;
    });
};
export const fetchModuleContentTest1 = (params: any = {}) => {
  return axios
    .get('/dummy/content/index')
    .then(({ config, data, status }) => data)
    .catch(error => {
      throw error;
    });
};
