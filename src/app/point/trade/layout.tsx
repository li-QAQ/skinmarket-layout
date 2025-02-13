'use client';
import { Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

interface TradeProps {
  children?: React.ReactNode;
}
const Trade = (props: TradeProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Segmented
          value={pathname}
          onChange={(value) => router.push(value)}
          options={[
            {
              label: '收購列表',
              value: '/point/trade',
            },
            {
              label: '出售列表',
              value: '/point/trade/buy',
            },
          ]}
        />
      </div>

      {props.children}
    </div>
  );
};

export default Trade;
