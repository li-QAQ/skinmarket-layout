import apiClient from '@/ultis/api';
import { getMerchantId } from '@/ultis/common';

// 取得會員資訊
interface AuthRefresh {
  id: string;
  login_token: string;
}
const auth_login = (data: AuthRefresh) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/login`, data);
};

const Auth = {
  auth_login,
};
export default Auth;
