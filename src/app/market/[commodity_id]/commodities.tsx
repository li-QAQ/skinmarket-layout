//import useAuthStore from '@/store/auth';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import BuyConfirmModal from './BuyConfirm';

const Commodities = () => {
  //const { info } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);

  const [openBuyConfirm, setOpenBuyConfirm] = useState(false);
  const [orderId, setOrderId] = useState('');

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
      align: 'right',
    },
    {
      title: '數量',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      width: 150,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, record: any) => {
        //if (record.name == info.userId) return;
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setOrderId(record.id);
              setOpenBuyConfirm(true);
            }}
          >
            購買
          </Button>
        );
      },
    },
  ] as any;

  const fetchInventorys = async () => {
    setItems(
      new Array(100).fill(0).map((_, i) => ({
        key: i,
        id: i,
        name: '賣家' + i,
        price: 100,
        stock: 100,
        date: new Date().toLocaleDateString(),
      })),
    );
  };

  useEffect(() => {
    fetchInventorys();
  }, []);

  return (
    <>
      <BuyConfirmModal
        open={openBuyConfirm}
        setOpen={setOpenBuyConfirm}
        onRefrash={fetchInventorys}
        orderId={orderId}
      />
      <Table rowKey="id" columns={columns} dataSource={items} />
    </>
  );
};

export default Commodities;
