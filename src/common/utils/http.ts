/**
 * express
 */
export const setRedirect = (response: any, { url = '' }: any = {}) => {
  // next js 리다이렉트
  /*return {
    redirect: {
      permanent: false,
      destination: '/store/empty',
    },
  };*/

  // 일반 리다이렉트
  // 301(영구 이동), 302(임시 이동), 검색 엔진 최적화
  response.statusCode = 302;
  response.setHeader('Location', url);
  response.end();
};
