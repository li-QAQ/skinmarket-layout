import apiClient from '@/ultis/api';
import { getMerchantId } from '@/ultis/common';

// 取得會員資訊
const get_point_order = () => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.get(`/${MERCHANT_ID}/market/point/order`);
};

interface BuyPointOrder {
  description: string;
  price: number;
  quantity: number;
}
const add_buy_point_order = (data: BuyPointOrder) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/market/point/order`, data);
};

interface ConfirmPointOrder {
  point_order_id: number;
  quantity: number;
}
const confirm_buy_point_order = (data: ConfirmPointOrder) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/market/point/order/buy`, data);
};

interface DelPointOrder {
  point_order_id: string;
}
const del_point_order = ({ point_order_id }: DelPointOrder) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.delete(
    `/${MERCHANT_ID}/market/point/order/${point_order_id}`,
  );
};

const Market = {
  get_point_order,
  add_buy_point_order,
  confirm_buy_point_order,
  del_point_order,
};
export default Market;
