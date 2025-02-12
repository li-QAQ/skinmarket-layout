'use client';

import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { numberCarry } from '@/ultis/common';

import Api from '@/api';
import usePointStore from '@/store/point';
import useInfoStore from '@/store/info';
import SellModal from '../sell';

const Page = () => {
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
      <SellModal open={isOpen} setOpen={setIsOpen} data={data} />

      <Table
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

export default Page;
