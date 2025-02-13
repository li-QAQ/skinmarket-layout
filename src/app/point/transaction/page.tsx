'use client';

import { numberFormat } from '@/ultis/common';
import { Button, Segmented, Table, Tabs, TabsProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const Order = () => {
  const [status, setStatus] = useState('request');
  const onChange = (key: string) => {
    setStatus(key);
  };

  const [data, setData] = useState<
    {
      id: number;
      price: number;
      quantity: number;
      trader: string;
      action: number;
      created_at: string;
      status: number;
    }[]
  >();

  const items: TabsProps['items'] = [
    {
      key: 'request',
      label: '付款列表',
      children: (
        <Segmented<string>
          options={['未付款', '已付款']}
          defaultValue="未付款"
          onChange={(value) => {
            console.log(value);

            switch (value) {
              case '未付款':
                setData([
                  {
                    id: 1,
                    price: 1.09,
                    quantity: 2000,
                    trader: '小明',
                    action: 1,
                    created_at: '2021-09-01',
                    status: 0,
                  },
                ]);

                break;
              case '已付款':
                setData([
                  {
                    id: 1,
                    price: 1.2,
                    quantity: 2000,
                    trader: '小餓',
                    action: 1,
                    created_at: '2021-09-03',
                    status: 1,
                  },
                ]);
                break;
              case '申訴中':
                setData([
                  {
                    id: 2,
                    price: 1.03,
                    quantity: 150,
                    trader: '小明',
                    action: 0,
                    created_at: '2021-09-11',
                    status: 2,
                  },
                ]);
                break;
            }
          }}
        />
      ),
    },
    {
      key: 'confirm',
      label: '收款列表',
      children: (
        <Segmented<string>
          options={['收款', '申訴中']}
          defaultValue="收款"
          onChange={(value) => {
            console.log(value);

            switch (value) {
              case '收款':
                setData([
                  {
                    id: 1,
                    price: 1.09,
                    quantity: 2000,
                    trader: '小明',
                    action: 1,
                    created_at: '2021-09-01',
                    status: 3,
                  },
                ]);

                break;
              case '申訴中':
                setData([
                  {
                    id: 2,
                    price: 1.03,
                    quantity: 150,
                    trader: '小明',
                    action: 0,
                    created_at: '2021-09-11',
                    status: 2,
                  },
                ]);
                break;
            }
          }}
        />
      ),
    },
    {
      key: 'history',
      label: '成交紀錄',
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
      title: '訂單編號',
      dataIndex: 'id',
    },
    {
      title: '價格',
      dataIndex: 'price',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      render: (quantity: number) => numberFormat(quantity),
      align: 'right',
    },
    {
      title: '總額',
      dataIndex: 'total',
      render: (_: any, record: any) =>
        `${numberFormat(record.price * record.quantity)} NT`,
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
      title: '日期',
      dataIndex: 'created_at',
      render: (created_at: string) => dayjs(created_at).format('YYYY-MM-DD'),
    },
    {
      title: '狀態',
      dataIndex: 'status',
      width: 250,
      render: (status: number) => {
        switch (status) {
          case 0:
            return (
              <div className="space-x-4">
                <Button type="primary">確認付款</Button>
                <Button type="primary" danger>
                  取消訂單
                </Button>
              </div>
            );
          case 1:
            return '等待對方確認收款……';
          case 2:
            return '申訴中';
          case 3:
            return (
              <div className="space-x-4">
                <Button type="primary">確認收款</Button>
                <Button type="primary" danger>
                  發起申訴
                </Button>
              </div>
            );
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

  // useEffect(() => {
  //   Api.Member.get_point_order_confirm_seller().then((res) => {
  //     setData(res.data);
  //   });
  // }, []);

  return (
    <div className="max-w-screen-xl mx-auto space-y-4">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      {status === 'request' && (
        <Table rowKey="id" dataSource={data} columns={columns} />
      )}

      {status === 'confirm' && (
        <Table rowKey="id" dataSource={data} columns={columns} />
      )}

      {status === 'history' && (
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
              order: 2,
              price: 1.2,
              count: 2000,
              trader: '小餓',
              action: 1,
              status: 1,
            },
            {
              date: '2021-09-11',
              order: 3,
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
