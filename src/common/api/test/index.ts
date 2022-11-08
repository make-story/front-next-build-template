/**
 * 테스트
 *
 * withCredentials: true 넣을 경우 에러!
 */
import axios from 'axios';

// test
export const getMainContentsNewOfTheMonth = (params: any = {}) => {
  return (
    axios
      .get('test', {
        params: {
          // 사용자 값
          ...params,
        },
      })
      .then(response => {
        return response?.data;
      })
      //.catch(error => ({ error }));
      .catch(error => {
        throw error;
      })
  );
};
