/**
 * 공통 설정 값
 */

const moduleDefaylt = {
  isRender: false,
  isLazyContent: true,
};
export const moduleInfo = {
  ABC_1: {
    ...moduleDefaylt,
    isLazyContent: false,
  },
  ABC_2: {
    ...moduleDefaylt,
  },
};

export default {};
