'use client';

import { Button, Table } from 'antd';
import { useState } from 'react';
import BuyModal from './buy';
import { numberCarry } from '@/ultis/common';

const Page = () => {
  const [data, setData] = useState({
    price: 1,
  });
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    {
      name: '小明',
      price: 1.09,
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
      price: 1.02,
      count: (
        <div>
          <div>4,450.09 NT</div>
          <div>$300.00 - $2,500.00</div>
        </div>
      ),
      payMenthod: 'Bank',
    },
    {
      name: '小紫',
      price: 1.1,
      count: (
        <div>
          <div>3,450.09 NT</div>
          <div>$200.00 - $1,500.00</div>
        </div>
      ),
      payMenthod: 'Bank',
    },
  ];

  return (
    <>
      <BuyModal open={isOpen} setOpen={setIsOpen} data={data} />
      <Table
        rowKey="name"
        size="large"
        columns={[
          {
            title: '賣家',
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
              if (record.name == '小紅') {
                return (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsOpen(true);
                      setData(record);
                    }}
                  >
                    購買
                  </Button>
                );
              } else {
                return (
                  <Button
                    type="primary"
                    disabled
                    onClick={() => {
                      setIsOpen(true);
                      setData(record);
                    }}
                  >
                    需完成店家認證
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
    </>
  );
};

export default Page;
