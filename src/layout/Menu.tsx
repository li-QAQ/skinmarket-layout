'use client';
import { Avatar, Dropdown, Button, Drawer } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  CreditCardOutlined,
  // HomeOutlined,
  ShoppingOutlined,
  // HistoryOutlined,
  // WalletOutlined,
} from '@ant-design/icons';
import useInfoStore from '@/store/info';
import { formatNumber } from '@/ultis/common';

const LayoutMenu = () => {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1];
  const router = useRouter();
  const { point, member_id } = useInfoStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for desktop menu
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add window resize listener to close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const items = [
    // {
    //   label: '首頁',
    //   key: 'home',
    //   path: '/',
    //   icon: <HomeOutlined />,
    // },
    {
      label: '點數交易',
      key: 'point',
      path: '/point/trade',
      icon: <CreditCardOutlined />,
    },
    {
      label: '市場',
      key: 'market',
      path: '/market',
      icon: <ShoppingOutlined />,
    },
    // {
    //   label: '交易記錄',
    //   key: 'history',
    //   path: '/history',
    //   icon: <HistoryOutlined />,
    // },
    // {
    //   label: '我的錢包',
    //   key: 'wallet',
    //   path: '/wallet',
    //   icon: <WalletOutlined />,
    // },
  ];

  const handleClick = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    {
      key: 'profile',
      label: '個人資料',
      icon: <UserOutlined />,
      onClick: () => {
        router.push('/profile');
        setMobileMenuOpen(false);
      },
    },
    {
      key: 'signOut',
      label: '登出',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem('token');
        router.push('/');
        setMobileMenuOpen(false);
      },
    },
  ];

  return (
    <header className="w-full">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gradient-to-r from-[#121212]/95 to-[#1a1a1a]/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-[#121212]/80 to-[#1a1a1a]/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Brand */}
            <div
              className="flex-shrink-0 font-bold text-xl md:text-2xl text-white cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-white group-hover:to-blue-300 transition-all duration-300">
                SkinMarket
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`cursor-pointer font-medium text-sm lg:text-base transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md ${
                    firstPath === item.key ||
                    (item.key === 'home' && firstPath === '')
                      ? 'text-white bg-[#ffffff15]'
                      : 'text-gray-300 hover:text-white hover:bg-[#ffffff10]'
                  }`}
                  onClick={() => handleClick(item.path)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-1">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-2 bg-[#ffffff15] hover:bg-[#ffffff20] transition-all duration-200 px-3 py-1.5 rounded-lg">
                <span className="text-base lg:text-lg font-bold text-white">
                  {formatNumber(point)}
                </span>
                <span className="text-xs text-gray-400">點數</span>
              </div>

              <Dropdown
                menu={{ items: menuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="flex items-center space-x-2 bg-[#ffffff15] hover:bg-[#ffffff20] transition-all duration-200 px-3 py-1.5 rounded-lg cursor-pointer">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span className="text-sm text-white hidden lg:inline-block">
                    {member_id}
                  </span>
                </div>
              </Dropdown>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-3">
              <div className="flex items-center space-x-1 bg-[#ffffff15] px-2 py-1 rounded-lg">
                <span className="text-sm font-bold text-white">
                  {formatNumber(point)}
                </span>
                <span className="text-xs text-gray-400">點</span>
              </div>

              <Button
                type="text"
                icon={<MenuOutlined className="text-white text-lg" />}
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center p-1"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={null}
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width="85%"
        styles={{
          body: {
            padding: 0,
          },
          header: {
            padding: 0,
            display: 'none',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
        rootClassName="md:hidden"
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-[#121212] to-[#1a1a1a]">
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div className="font-bold text-xl text-white">SkinMarket</div>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center"
            />
          </div>

          {/* User Info - Mobile */}
          <div className="p-4 bg-[#ffffff08] border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar size="large" icon={<UserOutlined />} />
              <div>
                <div className="text-white font-medium">用戶 {member_id}</div>
                <div className="text-gray-400 text-sm">
                  點數: {formatNumber(point)}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items - Mobile */}
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 px-4 py-3.5 cursor-pointer ${
                    firstPath === item.key ||
                    (item.key === 'home' && firstPath === '')
                      ? 'bg-[#ffffff15] text-white'
                      : 'text-gray-300 hover:bg-[#ffffff08]'
                  }`}
                  onClick={() => handleClick(item.path)}
                >
                  <span className="text-xl w-8">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}

              <div className="mt-4 border-t border-gray-800 pt-4">
                {/* Profile Menu Items */}
                {menuItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center space-x-3 px-4 py-3.5 cursor-pointer text-gray-300 hover:bg-[#ffffff08]"
                    onClick={item.onClick}
                  >
                    <span className="text-xl w-8">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
            © 2023 SkinMarket. All rights reserved.
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default LayoutMenu;
