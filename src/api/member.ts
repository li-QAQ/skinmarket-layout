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

// 取得買家點數訂單確認
const get_point_order_confirm_buyer = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.post(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/order/confirm/as-buyer`,
  );
};

// 取得賣家點數訂單確認
const get_point_order_confirm_seller = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/confirm/as-seller`,
  );
};

// 取得買家點數訂單確認失敗
const get_point_order_confirm_failed_buyer = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/order/confirm/failed/as-buyer`,
  );
};

// 取得賣家點數訂單確認失敗
const get_point_order_confirm_failed_seller = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/order/confirm/failed/as-seller`,
  );
};

// 刪除點數訂單確認
const del_point_order_confirm = ({
  point_order_confirm_id,
}: {
  point_order_confirm_id: string;
}) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.delete(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/order/confirm/${point_order_confirm_id}`,
  );
};

// 更新點數訂單確認
const upd_point_order_confirm = ({
  point_order_confirm_id,
  data,
}: {
  point_order_confirm_id: string;
  data: {
    status: number;
  };
}) => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.patch(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/order/confirm/${point_order_confirm_id}`,
    data,
  );
};

// 取得點數訂單歷史
const get_point_order_history = () => {
  const MERCHANT_ID = getMerchantId();
  const MEMBER_ID = getMemberId();
  return apiClient.get(
    `/${MERCHANT_ID}/member/${MEMBER_ID}/point/order/history`,
  );
};

const Member = {
  get_info,
  get_point_acquisition,
  get_point_order,
  get_point_order_confirm_buyer,
  get_point_order_confirm_seller,
  get_point_order_confirm_failed_buyer,
  get_point_order_confirm_failed_seller,
  del_point_order_confirm,
  upd_point_order_confirm,
  get_point_order_history,
};
export default Member;
