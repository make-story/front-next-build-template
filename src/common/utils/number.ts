/**
 * 숫자여부
 */
export const isNumber = (value: any) => Number.isInteger(value) || !isNaN(value - 0);
