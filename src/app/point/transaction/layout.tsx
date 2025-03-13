'use client';

import { Tabs, TabsProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const Order = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const onChange = (key: string) => {
    // Redirect to the request page when clicking on the buyer or seller tab
    if (key === '/point/transaction/buyer') {
      router.push('/point/transaction/buyer/request');
    } else if (key === '/point/transaction/seller') {
      router.push('/point/transaction/seller/request');
    } else {
      router.push(key);
    }
  };

  // Determine which tab should be active based on the current path
  const getActiveKey = () => {
    if (
      pathname === '/point/transaction' ||
      pathname.includes('/point/transaction/buyer')
    ) {
      return '/point/transaction/buyer';
    } else if (pathname.includes('/point/transaction/seller')) {
      return '/point/transaction/seller';
    } else if (pathname.includes('/point/transaction/history')) {
      return '/point/transaction/history';
    }
    return pathname;
  };

  const items: TabsProps['items'] = [
    {
      key: '/point/transaction/buyer',
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
    <div className="max-w-screen-xl mx-auto ">
      <Tabs activeKey={getActiveKey()} items={items} onChange={onChange} />
      {children}
    </div>
  );
};

export default Order;
