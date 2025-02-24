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

  return (
    <div className="max-w-screen-xl mx-auto my-4">
      <div className="flex">
        <Tabs
          className="w-full"
          activeKey={pathname}
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
          activeKey={pathname}
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
