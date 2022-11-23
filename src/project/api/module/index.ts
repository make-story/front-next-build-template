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
  return delay(randomNumberInRange(2000, 5000)).then(async () => {
    try {
      const { config, data, status } = await axios.get('/dummy/module/index');
      return { data };
    } catch (error) {
      throw error;
      //return { error };
    }
  });
};
