/**
 * 공통 설정 값
 */

const defaultItem = {
  moduleName: '',
  isRender: false,
  isLazyModule: true,
};
export const moduleInfo = {
  ABC_1: {
    ...defaultItem,
    moduleName: 'ABC_1',
    isLazyModule: false,
  },
  ABC_2: {
    ...defaultItem,
    moduleName: 'ABC_2',
  },
};

export default {};
