'use client';

import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { numberCarry, ThousandSymbolFormat } from '@/ultis/common';

import Api from '@/api';
import usePointStore from '@/store/point';
import useInfoStore from '@/store/info';
import BuyModal from '../buy';
import ResponsiveTable from '@/components/ResponsiveTable';

const BuyPage = () => {
  const [data, setData] = useState({
    id: 0,
    price: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const member_id = useInfoStore((state) => state.member_id);

  const point_order = usePointStore((state) => state.point_order);
  const set_point_order = usePointStore((state) => state.set_point_order);

  useEffect(() => {
    Api.Market.get_point_order().then((res) => {
      set_point_order(res.data);
    });
  }, []);

  return (
    <>
      <BuyModal open={isOpen} setOpen={setIsOpen} data={data} />

      <ResponsiveTable
        pagination={{
          pageSize: 9,
        }}
        rowKey="id"
        columns={[
          {
            title: '賣家',
            dataIndex: 'member_id',
            key: 'member_id',
          },
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
            title: '交易',
            key: 'action',
            width: 200,
            render: (_: any, record: any) => {
              return (
                member_id !== record.member_id && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsOpen(true);
                      setData(record);
                    }}
                  >
                    購買
                  </Button>
                )
              );
            },
          },
        ]}
        dataSource={point_order}
      />
    </>
  );
};

export default BuyPage;
