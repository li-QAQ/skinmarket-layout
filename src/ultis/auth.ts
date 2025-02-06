import md5 from 'md5';

export function getCurrentTimeFormatted(date?: Date) {
  const now = date || new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function generateHash(
  user_id: string,
  datetime: Date,
  secret_key: string = 'your-secret-key',
) {
  //Secret Key + user_id + YYYYmmDDHHMMSS 取MD5
  return md5(secret_key + user_id + getCurrentTimeFormatted(datetime));
}
