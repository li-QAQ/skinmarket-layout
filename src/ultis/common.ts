export const getMemberId = () => {
  return localStorage.getItem('member_id') || '';
};

export const getMerchantId = () => {
  return localStorage.getItem('merchant_id') || '';
};

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export const numberCarry = (num: number, length: number = 0): number => {
  const mantissa = 10 ** length;
  return Math.floor(num * mantissa) / mantissa;
};

// 數字1000 => 1,000， 以此類推
export const ThousandSymbolFormat = (num: number): string => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
