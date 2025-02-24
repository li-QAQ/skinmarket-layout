'use client';

import { Button, Popconfirm, Table } from 'antd';
import { useEffect } from 'react';
import { numberCarry, ThousandSymbolFormat } from '@/ultis/common';
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
            title: '數量',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right',
            render: (quantity: number) => {
              if (quantity === -1) {
                return '∞';
              } else {
                return ThousandSymbolFormat(quantity);
              }
            },
          },
          {
            title: '單價',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price: number) => `NT ${numberCarry(price, 2).toFixed(2)}`,
          },
          {
            title: '合計',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
            render: (_: any, record: any) => {
              if (record.quantity === -1) {
                return '∞';
              }
              return `NT ${ThousandSymbolFormat(record.price * record.quantity)}`;
            },
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
                <Popconfirm
                  title="確定要取消此訂單嗎？"
                  description="此操作不可逆"
                  okText="是"
                  cancelText="否"
                  onConfirm={() => {
                    cancelOrder(record.id);
                  }}
                >
                  <Button type="primary" danger>
                    取消
                  </Button>
                </Popconfirm>
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
