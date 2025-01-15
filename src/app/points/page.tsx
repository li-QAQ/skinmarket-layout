import { Button, Table } from 'antd';

const Points = () => {
  const items = [
    {
      name: '小明',
      price: 1.01,
      count: 12321,
      payMenthod: 'Bank',
    },
    {
      name: '小紅',
      price: 1.02,
      count: 234231,
      payMenthod: 'Bank',
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap w-full space-y-4 px-80">
        <div className="flex  items-center">名稱</div>
        <div className="flex ">價格</div>
        <div className="flex ">數量</div>
        <div className="flex ">支付方式</div>
        <div className="flex "></div>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-wrap w-full space-y-4 px-80 "
          style={{
            background: 'var(--secondary)',
          }}
        >
          <div className="flex  items-end">{item.name}</div>
          <div className="flex ">{item.price}</div>
          <div className="flex ">{item.count}</div>
          <div className="flex ">{item.payMenthod}</div>
          <div className="flex ">
            <Button type="primary">確認</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Points;
