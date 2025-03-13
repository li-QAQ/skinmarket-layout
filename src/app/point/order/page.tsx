'use client';

import { Button, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

import Api from '@/api';
import usePointStore from '@/store/point';
import useMessageStore from '@/store/message';
import PointOrderCard, { PointOrderItem } from '@/components/PointOrderCard';
import PointCardList from '@/components/PointCardList';

const PointOrderSell = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const point_order = usePointStore(
    (state) => state.point_order,
  ) as (PointOrderItem & { id: number })[];
  const setMsg = useMessageStore((state) => state.setData);
  const set_point_order = usePointStore((state) => state.set_point_order);

  const cancelOrder = (id: string) => {
    setLoading(true);
    Api.Market.del_point_order({ point_order_id: id })
      .then(async () => {
        await Api.Member.get_point_order().then((res) => {
          set_point_order(res.data);
        });

        setMsg({
          show: true,
          content: '出售訂單取消成功',
          type: 'success',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    Api.Member.get_point_order()
      .then((res) => {
        set_point_order(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderOrderCard = (item: PointOrderItem, index: number) => (
    <PointOrderCard
      key={item.id || index}
      item={item}
      showMemberId={false}
      showStatus={true}
      actionButton={
        item.status === 0 ? (
          <Popconfirm
            title="確定要取消此訂單嗎？"
            description="此操作不可逆"
            okText="是"
            cancelText="否"
            onConfirm={() => cancelOrder((item as any).id.toString())}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="w-full"
            >
              取消訂單
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="primary"
            onClick={() => cancelOrder((item as any).id.toString())}
            className="w-full"
          >
            刪除記錄
          </Button>
        )
      }
    />
  );

  return (
    <div>
      <PointCardList
        items={point_order}
        loading={loading}
        title="我的點數訂單"
        description="在這裡您可以查看和管理您的點數訂單。"
        emptyText="您還沒有任何點數訂單"
        renderItem={renderOrderCard}
        showPagination={point_order?.length > pageSize}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PointOrderSell;
