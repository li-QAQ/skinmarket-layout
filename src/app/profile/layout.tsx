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
    {
      label: '消息中心',
      key: '4',
      children: '',
    },
    {
      label: '幫助中心',
      key: '5',
      children: '',
    },
    {
      label: '聯繫客服',
      key: '6',
      children: '',
    },
  ];

  return (
    <div className="max-w-screen-xl flex items-center  mx-auto">
      <div className="bg-[var(--secondary)] w-full rounded-md">
        <Tabs
          activeKey={pathname}
          className="w-full font-bold"
          onChange={(value) => {
            router.push(value);
          }}
          items={items}
        />

        {children}
      </div>
    </div>
  );
};

export default Profile;
