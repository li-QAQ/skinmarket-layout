import apiClient from '@/ultis/api';
import { getMerchantId } from '@/ultis/common';

// 取得會員資訊
interface AuthRefresh {
  id: string;
  login_token: string;
}

interface RefreshTokenRequest {
  refresh_token: string;
}

const auth_login = (data: AuthRefresh) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/login`, data);
};

const auth_refresh = (data: AuthRefresh) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/refresh`, data);
};

// 刷新令牌，用于 KYC 验证成功后更新用户状态
const refresh_token = (data: RefreshTokenRequest) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/refresh`, data);
};

const Auth = {
  auth_login,
  auth_refresh,
  refresh_token,
};
export default Auth;
