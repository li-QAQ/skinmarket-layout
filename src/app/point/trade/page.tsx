'use client';

import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';

import Api from '@/api';
import usePointStore from '@/store/point';
import useInfoStore from '@/store/info';
import SellModal from './sell';
import PointOrderCard, { PointOrderItem } from '@/components/PointOrderCard';
import PointCardList from '@/components/PointCardList';

// Define the type expected by the SellModal
interface SellModalData {
  id: number;
  price: number;
  member_id?: string;
  quantity?: number;
  description?: string;
}

const TradePage = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<SellModalData | null>(
    null,
  );
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const pageSize = 9;

  const acquisition_order = usePointStore(
    (state) => state.acquisition_order,
  ) as PointOrderItem[];
  const member_id = useInfoStore((state) => state.member_id);
  const set_acquisition_order = usePointStore(
    (state) => state.set_acquisition_order,
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    Api.Market.get_point_acquisition()
      .then((res) => {
        set_acquisition_order(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSellClick = (order: PointOrderItem) => {
    // Convert PointOrderItem to SellModalData
    setSelectedOrder({
      id: order.id || 0,
      price: order.price,
      member_id: order.member_id,
      quantity: order.quantity,
      description: order.description,
    });
    setIsSellModalOpen(true);
  };

  // Filter out orders from the current user
  const filteredOrders = acquisition_order?.filter(
    (order) => order.member_id !== member_id,
  );

  const renderOrderCard = (item: PointOrderItem, index: number) => (
    <PointOrderCard
      key={item.id || index}
      item={item}
      showMemberId={true}
      actionButton={
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          className="w-full"
          onClick={() => handleSellClick(item)}
        >
          出售點數
        </Button>
      }
    />
  );

  return (
    <div>
      <PointCardList
        items={filteredOrders}
        loading={loading}
        title="點數交易市場"
        description="在這裡您可以查看其他用戶發布的點數收購訂單，並向他們出售您的點數。"
        emptyText="目前沒有可用的收購訂單"
        renderItem={renderOrderCard}
        showPagination={filteredOrders?.length > pageSize}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Sell Modal */}
      <SellModal
        open={isSellModalOpen}
        setOpen={setIsSellModalOpen}
        data={selectedOrder || { id: 0, price: 0 }}
      />
    </div>
  );
};

export default TradePage;
