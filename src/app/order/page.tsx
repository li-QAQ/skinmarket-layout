'use client';
import { Segmented, Table, Tabs, TabsProps } from 'antd';

const Order = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
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
      key: '2',
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
    },
    {
      title: '交易人',
      dataIndex: 'trader',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      render: (status: number) => {
        switch (status) {
          case 0:
            return '未付款';
          case 1:
            return '已付款';
          case 2:
            return '申訴中';
          default:
            return '';
        }
      },
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <Table
        rowKey="order"
        dataSource={[
          {
            date: '2021-09-01',
            order: 1,
            price: 1.09,
            count: 2000,
            trader: '小明',
            status: 0,
          },
          {
            date: '2021-09-11',
            order: 2,
            price: 1.03,
            count: 150,
            trader: '小明',
            status: 1,
          },
        ]}
        columns={columns}
      />
    </div>
  );
};

export default Order;
