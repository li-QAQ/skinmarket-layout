'use client';
import useMessageStore from '@/store/message';
import { message, Tabs } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PointsProps {
  children?: React.ReactNode;
}

const Point = (props: PointsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const data = useMessageStore((state) => state.data);
  const setData = useMessageStore((state) => state.setData);

  const onChange = (key: string) => {
    router.push(key);
  };

  useEffect(() => {
    if (data.content) {
      if (data.type === 'success') {
        messageApi.success(data.content);
      } else if (data.type === 'error') {
        messageApi.error(data.content);
      } else if (data.type === 'info') {
        messageApi.info(data.content);
      } else if (data.type === 'warning') {
        messageApi.warning(data.content);
      }
    }
    setData({ show: false, type: '', content: '' });
  }, [data.show]);

  return (
    <div className="max-w-screen-xl mx-auto my-4">
      {contextHolder}
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
              label: '交易管理',
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
