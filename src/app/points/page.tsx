'use client';
import { Button, Table } from 'antd';

const Points = () => {
  const items = [
    {
      name: '小明',
      price: <div>1.09 NT</div>,
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
      price: <div>1.02 NT</div>,
      count: (
        <div>
          <div>4,450.09 NT</div>
          <div>$300.00 - $2,500.00</div>
        </div>
      ),
      payMenthod: 'Bank',
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
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
            render: (text, record) => <Button type="primary">購買</Button>,
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
