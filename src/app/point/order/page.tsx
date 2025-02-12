'use client';

import { numberFormat } from '@/ultis/common';
import { Button, Segmented, Table, Tabs, TabsProps } from 'antd';
import { useState } from 'react';

const Order = () => {
  const [status, setStatus] = useState('in');
  const onChange = (key: string) => {
    setStatus(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'in',
      label: '進行中',
      children: (
        <Segmented<string>
          options={['所有', '未付款', '已付款', '申訴中']}
          defaultValue="所有"
          onChange={(value) => {
            console.log(value);
          }}
        />
      ),
    },
    {
      key: 'all',
      label: '所有訂單',
      children: (
        <Segmented<string>
          options={['所有', '已完成', '已取消']}
          defaultValue="所有"
          onChange={(value) => {
            console.log(value);
          }}
        />
      ),
    },
  ];

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '訂單編號',
      dataIndex: 'order',
    },
    {
      title: '價格',
      dataIndex: 'price',
    },
    {
      title: '數量',
      dataIndex: 'count',
      render: (count: number) => numberFormat(count),
      align: 'right',
    },
    {
      title: '總額',
      dataIndex: 'total',
      render: (_: any, record: any) =>
        `${numberFormat(record.price * record.count)} NT`,
      align: 'right',
    },
    {
      title: '交易人',
      dataIndex: 'trader',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (action: number) => {
        switch (action) {
          case 0:
            return '購買';
          case 1:
            return '出售';
          default:
            return '';
        }
      },
    },
    {
      title: '狀態',
      dataIndex: 'status',
      render: (status: number) => {
        switch (status) {
          case 0:
            return <Button type="primary">確認收款</Button>;
          case 1:
            return '等待對方確認收款……';
          case 2:
            return '申訴中';
          default:
            return '';
        }
      },
    },
  ];

  const columns1 = [
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '訂單編號',
      dataIndex: 'order',
    },
    {
      title: '價格',
      dataIndex: 'price',
      align: 'right',
    },
    {
      title: '數量',
      dataIndex: 'count',
      render: (count: number) => numberFormat(count),
      align: 'right',
    },
    {
      title: '總額',
      dataIndex: 'total',
      render: (_: any, record: any) =>
        `${numberFormat(record.price * record.count)} NT`,
      align: 'right',
    },
    {
      title: '交易人',
      dataIndex: 'trader',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (action: number) => {
        switch (action) {
          case 0:
            return '購買';
          case 1:
            return '出售';
          default:
            return '';
        }
      },
    },
    {
      title: '狀態',
      dataIndex: 'status',
      render: (status: number) => {
        switch (status) {
          case 0:
            return '取消';
          case 1:
            return '完成';
          default:
            return '';
        }
      },
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto space-y-4">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      {status === 'in' ? (
        <Table
          rowKey="order"
          dataSource={[
            {
              date: '2021-09-01',
              order: 1,
              price: 1.09,
              count: 2000,
              trader: '小明',
              action: 1,
              status: 0,
            },
            {
              date: '2021-09-11',
              order: 2,
              price: 1.03,
              count: 150,
              action: 0,
              trader: '小明',
              status: 1,
            },
          ]}
          columns={columns}
        />
      ) : (
        <Table
          rowKey="order"
          dataSource={[
            {
              date: '2021-09-01',
              order: 1,
              price: 1.09,
              count: 2000,
              trader: '小明',
              action: 1,
              status: 0,
            },
            {
              date: '2021-09-03',
              order: 1,
              price: 1.2,
              count: 2000,
              trader: '小餓',
              action: 1,
              status: 1,
            },
            {
              date: '2021-09-11',
              order: 2,
              price: 1.03,
              count: 150,
              trader: '小明',
              action: 0,
              status: 1,
            },
          ]}
          columns={columns1}
        />
      )}
    </div>
  );
};

export default Order;
