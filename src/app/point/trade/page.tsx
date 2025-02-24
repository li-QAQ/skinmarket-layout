'use client';

import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { numberCarry, ThousandSymbolFormat } from '@/ultis/common';

import Api from '@/api';
import usePointStore from '@/store/point';
import useInfoStore from '@/store/info';
import SellModal from './sell';

const Page = () => {
  const [data, setData] = useState({
    id: 0,
    price: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const member_id = useInfoStore((state) => state.member_id);

  const acquisition_order = usePointStore((state) => state.acquisition_order);
  const set_acquisition_order = usePointStore(
    (state) => state.set_acquisition_order,
  );

  useEffect(() => {
    Api.Market.get_point_acquisition().then((res) => {
      set_acquisition_order(res.data);
    });
  }, []);

  return (
    <>
      <SellModal open={isOpen} setOpen={setIsOpen} data={data} />
      <Table
        pagination={{
          pageSize: 9,
        }}
        rowKey="id"
        columns={[
          {
            title: '買家',
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
                    danger
                    onClick={() => {
                      setIsOpen(true);
                      setData(record);
                    }}
                  >
                    出售
                  </Button>
                )
              );
            },
          },
        ]}
        dataSource={acquisition_order}
      />
    </>
  );
};

export default Page;
