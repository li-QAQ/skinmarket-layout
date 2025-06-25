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

// 刷新令牌，用于 KYC 验证成功后更新用户状态
const refresh_token = (data: RefreshTokenRequest) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/refresh`, data);
};

const auth_update = (data: RefreshTokenRequest) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/auth/update`, data);
};

const Auth = {
  auth_login,
  refresh_token,
  auth_update,
};
export default Auth;
