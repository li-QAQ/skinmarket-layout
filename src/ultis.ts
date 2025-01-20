export const numberCarry = (num: number, length: number = 0): number => {
  const mantissa = 10 ** length;
  return Math.floor(num * mantissa) / mantissa;
};
