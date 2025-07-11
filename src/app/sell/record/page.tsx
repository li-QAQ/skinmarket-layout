'use client';

import { Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const SellHistory = () => {
  const [items, setItems] = useState<any[]>([]);

  const fetchSellHistory = async () => {
    setItems([
      {
        key: 1,
        id: 1,
        buyer_id: '小明',
        price: 100,
        quantity: 100,
        status: 'status',
        created_at: dayjs().unix(),
        deleted_at: '',
      },
      {
        key: 2,
        id: 2,
        buyer_id: '小紅',
        price: 300,
        quantity: 100,
        status: 'status',
        created_at: dayjs().unix(),
        deleted_at: '',
      },
    ]);
  };

  useEffect(() => {
    fetchSellHistory();
  }, []);

  const columns = [
    {
      title: '買家',
      dataIndex: 'buyer_id',
      key: 'buyer_id',
    },
    {
      title: '單價',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'Quantity',
      align: 'right',
    },
    {
      title: '總額',
      dataIndex: 'total',
      key: 'Total',
      render: (text: string, record: any) => {
        return record.price * record.quantity;
      },
      align: 'right',
    },
    {
      title: '日期',
      dataIndex: 'created_at',
      key: 'CreatedAt',
      width: 200,
      render: (text: string) => {
        return dayjs(parseInt(text) * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  return <Table rowKey="id" columns={columns as any} dataSource={items} />;
};

export default SellHistory;
