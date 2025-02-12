'use client';
import { Avatar, Dropdown } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import useInfoStore from '@/store/info';

const LayoutMenu = () => {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1];
  const router = useRouter();
  const { point, member_id } = useInfoStore();
  const itmes = [
    {
      label: '點數交易',
      key: 'point',
      path: '/point/trade',
    },
    // {
    //   label: '市場',
    //   key: 'market',
    //   path: '/market',
    // },
    // {
    //   label: '背包',
    //   key: 'bag',
    //   path: '/bag',
    // },
    // {
    //   label: '出售管理',
    //   key: 'sell',
    //   path: '/sell',
    // },
    // {
    //   label: '購買記錄',
    //   key: 'buy',
    //   path: '/buy',
    // },
    // {
    //   label: '確認交易',
    //   key: 'confirm',
    //   path: '/confirm',
    // },
  ];

  const hanldleClick = (path: string) => {
    router.push(path);
  };

  const menuItems: any = [
    {
      key: 'profile',
      label: '個人資料',
      icon: <UserOutlined />,
      onClick: () => {
        router.push('/profile');
      },
    },
    {
      key: 'signOut',
      label: '登出',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem('token');
        router.push('/');
      },
    },
  ];

  return (
    <div className="max-w-screen-xl flex items-center h-20 mx-auto justify-between">
      <div className="flex space-x-8 font-bold text-sm ">
        {itmes.map((item, index) => {
          return (
            <div
              key={index}
              className="cursor-pointer text-slate-50 hover:text-slate-400"
              onClick={() => hanldleClick(item.path)}
              style={{
                borderBottom:
                  firstPath === item.key ? '2px solid white' : 'none',
              }}
            >
              <div>{item.label}</div>
            </div>
          );
        })}
      </div>
      <div className="text-white flex items-center space-x-4">
        <div className="relative flex  bg-[#ffffff10] p-2 rounded-md font-bold">
          <span className="text-lg font-bold">{point}</span>
          <sup className="ml-1 text-xs text-gray-400">點數</sup>
        </div>

        <div className="relative flex  bg-[#ffffff10] p-2 rounded-md font-bold">
          <span className="text-lg font-bold">{member_id}</span>
          <sup className="ml-1 text-xs text-gray-400">用戶</sup>
        </div>

        <Dropdown menu={{ items: menuItems }} className="cursor-pointer ">
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default LayoutMenu;
