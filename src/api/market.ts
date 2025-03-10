import apiClient from '@/ultis/api';
import { getMerchantId } from '@/ultis/common';

const get_point_acquisition = () => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.get(`/${MERCHANT_ID}/market/point/acquisition`);
};
interface PointAcquisition {
  description: string;
  price: number;
  quantity: number;
}
const post_point_acquisition = (data: PointAcquisition) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/market/point/acquisition`, data);
};
interface PointAcquisitionSell {
  point_acquisition_id: number;
  quantity: number;
}
const post_point_acquisition_sell = (data: PointAcquisitionSell) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/market/point/acquisition/sell`, data);
};
const del_point_acquisition = ({
  point_acquisition_id,
}: {
  point_acquisition_id: string;
}) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.delete(
    `/${MERCHANT_ID}/market/point/acquisition/${point_acquisition_id}`,
  );
};

const get_point_order = () => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.get(`/${MERCHANT_ID}/market/point/order`);
};
interface BuyPointOrder {
  description: string;
  price: number;
  quantity: number;
}
const post_point_order = (data: BuyPointOrder) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/market/point/order`, data);
};
interface ConfirmPointOrder {
  point_order_id: number;
  quantity: number;
}
const post_point_order_buy = (data: ConfirmPointOrder) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.post(`/${MERCHANT_ID}/market/point/order/buy`, data);
};
const del_point_order = ({ point_order_id }: { point_order_id: string }) => {
  const MERCHANT_ID = getMerchantId();
  return apiClient.delete(
    `/${MERCHANT_ID}/market/point/order/${point_order_id}`,
  );
};

const Market = {
  get_point_acquisition,
  post_point_acquisition,
  post_point_acquisition_sell,
  del_point_acquisition,
  get_point_order,
  post_point_order,
  post_point_order_buy,
  del_point_order,
};
export default Market;
