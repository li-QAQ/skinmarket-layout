'use client';

import { Button, Table } from 'antd';
import { useEffect } from 'react';
import { numberCarry } from '@/ultis/common';
import Api from '@/api';
import usePointStore from '@/store/point';
import useMessageStore from '@/store/message';

const PointOrderSell = () => {
  const point_order = usePointStore((state) => state.point_order);
  const setMsg = useMessageStore((state) => state.setData);
  const set_point_order = usePointStore((state) => state.set_point_order);

  const cancelOrder = (id: string) => {
    Api.Market.del_point_order({ point_order_id: id }).then(async () => {
      await Api.Member.get_point_order().then((res) => {
        set_point_order(res.data);
      });

      setMsg({
        show: true,
        content: '出售訂單取消成功',
        type: 'success',
      });
    });
  };

  useEffect(() => {
    Api.Member.get_point_order().then((res) => {
      set_point_order(res.data);
    });
  }, []);

  return (
    <>
      <Table
        rowKey="id"
        columns={[
          {
            title: '價格(台幣/點數)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${numberCarry(price, 2).toFixed(2)} NT`,
          },
          {
            title: '點數數量',
            dataIndex: 'quantity',
            key: 'quantity',
          },
          {
            title: '備註',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_: any, record: any) => {
              return (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    cancelOrder(record.id);
                  }}
                >
                  取消
                </Button>
              );
            },
          },
        ]}
        dataSource={point_order}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </>
  );
};

export default PointOrderSell;
