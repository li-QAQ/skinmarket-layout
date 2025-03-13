'use client';
import { Tabs } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const Profile = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    {
      label: '我的點數',
      key: '/profile',
    },
    {
      label: '個人資料',
      key: '/profile/info',
    },
    {
      label: '收款方式',
      key: '/profile/payment',
    },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <div className="bg-[var(--secondary)] w-full rounded-lg shadow-sm overflow-hidden">
        <Tabs
          activeKey={pathname}
          className="w-full font-bold"
          onChange={(value) => {
            router.push(value);
          }}
          items={items}
          size="large"
          tabBarStyle={{
            margin: '0 16px',
          }}
        />

        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default Profile;
