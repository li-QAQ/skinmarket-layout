import apiClient from '@/ultis/api';
import { generateHash, getCurrentTimeFormatted } from '@/ultis/auth';

const MERCHANT_ID = process.env.NEXT_PUBLIC_MERCHANT_ID;

interface Auth {
  user_id: string;
}

const Auth = ({ user_id }: Auth): any => {
  const date = new Date();
  const datetime = getCurrentTimeFormatted(date);
  return apiClient.post(`/${MERCHANT_ID}/api/member/auth`, {
    id: user_id,
    hash: generateHash(user_id, date),
    datetime,
  });
};

export default Auth;
