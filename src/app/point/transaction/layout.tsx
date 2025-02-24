'use client';

import { Tabs, TabsProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const Order = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const onChange = (key: string) => {
    router.push(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '/point/transaction',
      label: '購入請求列表',
    },
    {
      key: '/point/transaction/seller',
      label: '賣出請求列表',
    },
    {
      key: '/point/transaction/history',
      label: '交易記錄',
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto space-y-4">
      <Tabs activeKey={pathname} items={items} onChange={onChange} />
      {children}
    </div>
  );
};

export default Order;
