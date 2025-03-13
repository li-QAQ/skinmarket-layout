'use client';

import { Tabs } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

interface PointsProps {
  children?: React.ReactNode;
}

const Point = (props: PointsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (key: string) => {
    router.push(key);
  };

  // Determine which tab should be active based on the current path
  const getActiveKey = (tabKeys: string[]) => {
    for (const key of tabKeys) {
      if (pathname === key || pathname.includes(key + '/')) {
        return key;
      }
    }
    return pathname;
  };

  // Define tab keys for each tab group
  const leftTabKeys = ['/point/trade'];
  const rightTabKeys = ['/point/order', '/point/transaction'];

  return (
    <div className="max-w-screen-xl mx-auto my-4">
      <div className="flex">
        <Tabs
          className="w-full"
          size="large"
          activeKey={getActiveKey(leftTabKeys)}
          items={[
            {
              key: '/point/trade',
              label: '點數交易',
            },
          ]}
          onChange={onChange}
        />
        <Tabs
          className="w-auto"
          size="large"
          activeKey={getActiveKey(rightTabKeys)}
          items={[
            {
              key: '/point/order',
              label: '點數交易發佈管理',
            },
            {
              key: '/point/transaction',
              label: '待確認交易列表',
            },
          ]}
          onChange={onChange}
        />
      </div>
      {props.children}
    </div>
  );
};

export default Point;
