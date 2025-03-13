'use client';

import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';

import Api from '@/api';
import usePointStore from '@/store/point';
import useInfoStore from '@/store/info';
import BuyModal from '../buy';
import PointOrderCard, { PointOrderItem } from '@/components/PointOrderCard';
import PointCardList from '@/components/PointCardList';

const BuyPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<{
    id: number;
    price: number;
    description?: string;
    quantity?: number;
    member_id?: string;
  }>({
    id: 0,
    price: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const member_id = useInfoStore((state) => state.member_id);

  const point_order = usePointStore(
    (state) => state.point_order,
  ) as PointOrderItem[];
  const set_point_order = usePointStore((state) => state.set_point_order);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    Api.Market.get_point_order()
      .then((res) => {
        set_point_order(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Filter out orders from the current user
  const filteredOrders =
    point_order?.filter((order) => order.member_id !== member_id) || [];

  const handleBuyClick = (record: PointOrderItem & { id: number }) => {
    setSelectedOrder({
      id: record.id,
      price: record.price,
      description: record.description,
      quantity: record.quantity,
      member_id: record.member_id,
    });
    setIsOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderOrderCard = (item: PointOrderItem, index: number) => (
    <PointOrderCard
      key={item.id || index}
      item={item}
      actionButton={
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() =>
            handleBuyClick(item as PointOrderItem & { id: number })
          }
          className="w-full"
        >
          購買點數
        </Button>
      }
    />
  );

  return (
    <div>
      <BuyModal open={isOpen} setOpen={setIsOpen} data={selectedOrder} />

      <PointCardList
        items={filteredOrders}
        loading={loading}
        title="點數購買市場"
        description="在這裡您可以查看所有賣家的點數出售訂單，並選擇購買您需要的點數。"
        emptyText="目前沒有可用的出售訂單，請稍後再查看"
        renderItem={renderOrderCard}
        showPagination={filteredOrders.length > pageSize}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BuyPage;
