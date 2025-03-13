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

/**
 * Format number with thousands separator and optional decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with thousands separators
 */
export const formatNumber = (
  value: number | undefined | null,
  decimals: number = 0,
): string => {
  // Handle undefined, null, NaN or invalid values
  if (value === undefined || value === null || isNaN(Number(value))) return '0';

  // Ensure value is a number
  const numValue = Number(value);

  // Format with specified decimal places
  const formattedValue =
    decimals > 0 ? numValue.toFixed(decimals) : Math.floor(numValue).toString();

  // Add thousands separators
  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * InputNumber formatter - Adds thousands separators to displayed value
 * @param value - The number to format
 * @returns Formatted string with thousands separators
 */
export const numberFormatter = (value: number | undefined): string => {
  if (value === undefined || value === null) return '';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * InputNumber parser - Removes thousands separators for processing
 * @param value - The formatted string to parse
 * @returns Clean string without separators
 */
export const numberParser = (value: string | undefined): string => {
  if (value === undefined || value === null) return '';
  return value.replace(/\$\s?|(,*)/g, '');
};
