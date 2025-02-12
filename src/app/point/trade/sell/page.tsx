'use client';
import { Button, Table } from 'antd';

import { useState } from 'react';

import SellModal from '../sell';
import { numberCarry } from '@/ultis/common';

const Points = () => {
  const items = [
    {
      name: '小明',
      price: 0.99,
      count: (
        <div>
          <div>4,450.09 NT</div>
          <div>$300.00 - $2,500.00</div>
        </div>
      ),
      payMenthod: 'Bank',
    },
    {
      name: '小紅',
      price: 0.97,
      count: (
        <div>
          <div>4,450.09 NT</div>
          <div>$300.00 - $2,500.00</div>
        </div>
      ),
      payMenthod: 'Bank',
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    price: 1,
  });

  return (
    <div>
      <SellModal open={isOpen} setOpen={setIsOpen} data={data} />
      <Table
        rowKey="name"
        size="large"
        columns={[
          {
            title: '買家',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '價格',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${numberCarry(price, 2).toFixed(2)} NT`,
          },
          {
            title: '數量/訂單限額',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: '支付方式',
            dataIndex: 'payMenthod',
            key: 'payMenthod',
          },
          {
            title: '交易',
            key: 'action',
            width: 200,
            render: (_: any, record: any) => {
              if (record.name == '小明') {
                return (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsOpen(true);
                      setData(record);
                    }}
                  >
                    請先完成KYC驗證
                  </Button>
                );
              } else {
                return (
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
                );
              }
            },
          },
        ]}
        dataSource={items}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
};

export default Points;
