import { Table } from 'antd';

//const { useToken } = theme;

const Record = () => {
  const columns = [
    {
      title: '賣家',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '單價',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '數量',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const data = new Array(100).fill(0).map((_, i) => ({
    key: i,
    name: '賣家' + i,
    price: 100,
    stock: 100,
    date: new Date().toLocaleDateString(),
  }));

  return <Table columns={columns} dataSource={data} />;
};
// 1. 上傳單據
// 2. 後台管理
// 3. 賣家確認視窗
export default Record;
