'use client';
import { Tabs, TabsProps } from 'antd';
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

  const items: TabsProps['items'] = [
    {
      key: '/point/trade',
      label: 'C2C交易',
    },
    {
      key: '/point/order',
      label: '訂單管理',
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto my-4">
      <Tabs defaultActiveKey={pathname} items={items} onChange={onChange} />
      {props.children}
    </div>
  );
};

export default Point;
