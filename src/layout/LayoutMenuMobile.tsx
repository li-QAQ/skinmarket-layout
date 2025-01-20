'use client';
import { Button } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { MenuOutlined } from '@ant-design/icons';
import LoginModal from '@/components/Login';
import { useState } from 'react';

const LayoutMenuMobile = () => {
  const pathname = usePathname();
  const router = useRouter();
  const itmes = [
    {
      label: '市場',
      path: '/',
    },
    {
      label: '背包',
      path: '/bag',
    },
    {
      label: '出售管理',
      path: '/sell',
    },
    {
      label: '訂單管理',
      path: '/order',
    },
  ];
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const hanldleClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="h-full w-full flex items-center bg-[var(--secondary)] justify-between">
      <MenuOutlined className="text-2xl" />
      <LoginModal
        open={isOpenLogin}
        setOpen={(open) => {
          setIsOpenLogin(open);
        }}
      />
      <Button type="primary" size="middle" onClick={() => setIsOpenLogin(true)}>
        登入
      </Button>
    </div>
  );
};

export default LayoutMenuMobile;
