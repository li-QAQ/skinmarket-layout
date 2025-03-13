'use client';
import { Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine which tab is active based on the current path
  const getCurrentTab = () => {
    if (pathname.includes('/failed')) {
      return 'failed';
    }
    return 'request';
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Segmented
          value={getCurrentTab()}
          options={[
            {
              value: 'request',
              label: '請求中',
            },
            {
              value: 'failed',
              label: '失敗記錄',
            },
          ]}
          onChange={(value) => router.push(`/point/transaction/buyer/${value}`)}
        />
      </div>

      {children}
    </div>
  );
}
