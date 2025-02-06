export const numberCarry = (num: number, length: number = 0): number => {
  const mantissa = 10 ** length;
  return Math.floor(num * mantissa) / mantissa;
};

// 數字1000 => 1,000， 以此類推
export const numberFormat = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
