/**
 * 테스트
 * withCredentials: 쿠키전송
 */
import axios from 'axios';

// test
export const fetchTest = (params: any = {}) => {
  return axios
    .get('test', {
      params: {
        // 사용자 값
        ...params,
      },
    })
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      throw error;
      //return { error };
    });
};
