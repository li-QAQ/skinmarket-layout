'use client';
import { Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

interface PointsProps {
  children?: React.ReactNode;
}
const Points = (props: PointsProps) => {
  const pahtname = usePathname();
  const router = useRouter();

  return (
    <div className="max-w-[1200px] mx-auto my-8 space-y-8">
      <Segmented
        style={{
          padding: '4px 8px',
        }}
        size="large"
        value={pahtname}
        onChange={(value) => router.push(value)}
        options={[
          {
            label: '購買',
            value: '/points',
          },
          {
            label: '出售',
            value: '/points/sell',
          },
        ]}
      />

      {props.children}
    </div>
  );
};

export default Points;
