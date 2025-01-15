'use client';

import useAuthStore from '@/store/auth';

import { Button, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const ConfirmPage = () => {
  const [items, setItems] = useState<any[]>([]);

  const fetchConfirmOrders = async () => {
    setItems([
      {
        key: 1,
        id: 1,
        buyer_id: '小明',
        price: 100,
        quantity: 100,
        status: 'status',
        image: '/images/aug.png',
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
        image: '/images/aug1.png',
        created_at: dayjs().unix(),
        deleted_at: '',
      },
    ]);
  };

  const handleConfirm = async (record: any) => {};

  useEffect(() => {
    fetchConfirmOrders();
  }, []);

  const columns = [
    {
      title: '物品',
      dataIndex: 'image',
      key: 'image',
      render: (_: any, record: any) => {
        return (
          <img src={record.image} alt={record.name} style={{ width: 50 }} />
        );
      },
    },
    {
      title: '買家',
      dataIndex: 'buyer_id',
      key: 'name',
    },
    {
      title: '單價',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'Quantity',
    },
    {
      title: '總價',
      dataIndex: 'Total',
      key: 'Total',
      render: (_: any, record: any) => {
        return record.price * record.quantity;
      },
    },
    {
      title: '日期',
      dataIndex: 'created_at',
      key: 'CreatedAt',
      render: (text: string) => {
        return dayjs(parseInt(text) * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      dataIndex: 'Action',
      key: 'Action',
      width: 200,
      render: (_: string, record: any) => {
        return (
          <div className="space-x-2">
            <Button type="primary" onClick={() => handleConfirm(record)}>
              確認
            </Button>
            <Button type="primary" ghost>
              拒絕
            </Button>
          </div>
        );
      },
    },
  ];

  return <Table rowKey="id" columns={columns as any} dataSource={items} />;
};

export default ConfirmPage;
