'use client';

import { Button, Tabs, TabsProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import BuyPublishModal from '@/app/point/order/buyPublish';
import SellPublishModal from '@/app/point/order/sellPublish';
import { useState } from 'react';

const Order = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openBuy, setOpenBuy] = useState(false);
  const [openSell, setOpenSell] = useState(false);

  const onChange = (key: string) => {
    router.push(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '/point/order',
      label: '我的販售',
    },
    {
      key: '/point/order/buy',
      label: '我的收購',
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto space-y-4">
      <BuyPublishModal open={openBuy} setOpen={setOpenBuy} />
      <SellPublishModal open={openSell} setOpen={setOpenSell} />
      <Tabs
        activeKey={pathname}
        items={items}
        onChange={onChange}
        tabBarExtraContent={
          <div className="space-x-4">
            <Button
              type="primary"
              danger
              onClick={() => {
                setOpenSell(true);
              }}
            >
              我要出售點數
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setOpenBuy(true);
              }}
            >
              我要收購點數
            </Button>
          </div>
        }
      />
      {children}
    </div>
  );
};

export default Order;
