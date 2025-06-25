import apiClient from '@/ultis/api';
import { getMemberId, getMerchantId } from '@/ultis/common';

// 取得會員資訊
const get_info = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(`/${MERCHANT_ID}/member/${MEMBER_ID}`);
};

// 取得點數訂單
const get_point_acquisition = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(`/${MERCHANT_ID}/member/${MEMBER_ID}/point/acquisition`);
};

// 取得點數訂單
const get_point_order = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(`/${MERCHANT_ID}/member/${MEMBER_ID}/point/order`);
};

// 取得點數訂單確認
const get_point_confirm_buyer = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/as-buyer`,
  );
};

// 取得點數訂單確認
const get_point_confirm_seller = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/as-seller`,
  );
};

// 取得點數訂單，取消請求記錄
const get_point_confirm_failed_buyer = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/failed/as-buyer`,
  );
};

// 取得點數訂單，拒絕確認記錄
const get_point_confirm_failed_seller = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/failed/as-seller`,
  );
};

// 刪除點數訂單確認
const del_point_confirm = (id: number) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.delete(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/${id}`,
  );
};

// 更新點數訂單確認
const patch_point_confirm = (id: number, status: number) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.patch(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/${id}`,
    { status },
  );
};

// 取得點數交易紀錄
const get_point_transaction_history = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/transaction/history`,
  );
};

// 取得 KYC 資訊
const get_kyc = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(`/${MERCHANT_ID}/member/${MEMBER_ID}/kyc`);
};

// 新增 KYC 資訊
const post_kyc = (data: any) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.put(`/${MERCHANT_ID}/member/${MEMBER_ID}/kyc`, data);
};

// 取得銀行賬戶
const get_bank = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(`/${MERCHANT_ID}/member/${MEMBER_ID}/bank`);
};

// 新增銀行賬戶
const post_bank = (data: any) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.post(`/${MERCHANT_ID}/member/${MEMBER_ID}/bank`, data);
};

const del_bank = (id: number) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.delete(`/${MERCHANT_ID}/member/${MEMBER_ID}/bank/${id}`);
};

const post_upload_receipt = (confirm_id: string, data: any) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.post(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/${confirm_id}/upload`,
    data,
  );
};

// 取得公開支付方式
const get_public_payment_method = (member_id: string) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${member_id}/public/payment_method`,
  );
};

const get_notification = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(`/${MERCHANT_ID}/member/${MEMBER_ID}/notification`);
};

const patch_notification_mark_read = (data: { notification_ids: string[] }) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.patch(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/notification/mark-read`,
    data,
  );
};

const patch_notification_mark_all_read = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.patch(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/notification/mark-all-read`,
  );
};

const Member = {
  get_info,
  get_point_acquisition,
  get_point_confirm_buyer,
  get_point_confirm_seller,
  get_point_confirm_failed_buyer,
  get_point_confirm_failed_seller,
  del_point_confirm,
  patch_point_confirm,
  get_point_order,
  get_point_transaction_history,
  get_kyc,
  post_kyc,
  get_bank,
  post_bank,
  del_bank,
  post_upload_receipt,
  get_public_payment_method,
  get_notification,
  patch_notification_mark_read,
  patch_notification_mark_all_read,
};
export default Member;
