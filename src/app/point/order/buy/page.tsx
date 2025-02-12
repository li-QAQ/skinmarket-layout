'use client';

import { Button, Table } from 'antd';
import { useEffect } from 'react';
import { numberCarry } from '@/ultis/common';
import Api from '@/api';
import usePointStore from '@/store/point';
import useMessageStore from '@/store/message';

const PointOrderBuy = () => {
  const acquisition_order = usePointStore((state) => state.acquisition_order);
  const setMsg = useMessageStore((state) => state.setData);
  const set_acquisition_order = usePointStore(
    (state) => state.set_acquisition_order,
  );

  const cancelOrder = (id: string) => {
    Api.Market.del_point_acquisition({ point_acquisition_id: id }).then(
      async () => {
        await Api.Member.get_point_acquisition().then((res) => {
          set_acquisition_order(res.data);
        });

        setMsg({
          show: true,
          content: '收購訂單取消成功',
          type: 'success',
        });
      },
    );
  };

  useEffect(() => {
    Api.Member.get_point_acquisition().then((res) => {
      set_acquisition_order(res.data);
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
        dataSource={acquisition_order}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </>
  );
};

export default PointOrderBuy;
