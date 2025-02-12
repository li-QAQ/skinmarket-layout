import apiClient from '@/ultis/api';
import { getMerchantId } from '@/ultis/common';

// 取得會員資訊
interface AuthRefresh {
  refresh_token: string;
}
const auth_refresh = (data: AuthRefresh) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/refresh`, data);
};

const Auth = {
  auth_refresh,
};
export default Auth;
