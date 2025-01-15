'use client';

import { Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

interface SellProps {
  children?: React.ReactNode;
}
const Sell = (props: SellProps) => {
  const pahtname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col">
      <Segmented
        value={pahtname}
        style={{
          marginBottom: 8,
          padding: '8px 16px',
        }}
        onChange={(value) => router.push(value)}
        options={[
          {
            label: '當前在售',
            value: '/sell',
          },
          {
            label: '出售紀錄',
            value: '/sell/record',
          },
        ]}
      />
      {props.children}
    </div>
  );
};

export default Sell;
