'use client';
import { Avatar, Button, RadioChangeEvent, Tabs } from 'antd';
import { useState } from 'react';
import KYCModal from './kyc';

const Profile = () => {
  const [tabPosition, setTabPosition] = useState('left');
  const [isOpenKYC, setIsOpenKYC] = useState(false);

  const changeTabPosition = (e: RadioChangeEvent) => {
    setTabPosition(e.target.value);
  };

  const items = [
    {
      label: '我的點數',
      key: '1',
      children: (
        <div className="space-y-4">
          <div>我的點數</div>
          <div className="font-normal space-y-6">
            <div className="flex items-center">
              <div className="basis-1/6">點數</div>
              <div className="basis-5/6">1000</div>
            </div>
            <div className="flex items-center">
              <div className="basis-1/6">凍結點數</div>
              <div className="basis-5/6">300</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: '個人資料',
      key: '2',
      children: (
        <div className="space-y-4">
          <div>賬戶信息</div>
          <div className="font-normal space-y-6">
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">頭像</div>
              <div className="basis-5/6">
                <Avatar size={32} />
              </div>
            </div>
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">名稱</div>
              <div className="basis-5/6">管理者</div>
            </div>
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">Email</div>
              <div className="basis-5/6">admin@admin.com</div>
            </div>
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">KYC 實名</div>
              <div className="basis-5/6">
                <KYCModal open={isOpenKYC} setOpen={setIsOpenKYC} />
                <Button type="primary" ghost onClick={() => setIsOpenKYC(true)}>
                  驗證
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: '消息中心',
      key: '3',
      children: '',
    },
    {
      label: '幫助中心',
      key: '4',
      children: '',
    },
    {
      label: '聯繫客服',
      key: '5',
      children: '',
    },
  ];

  return (
    <div className="max-w-screen-2xl flex items-center  mx-auto">
      <div className="bg-[var(--secondary)] w-full rounded-md">
        <Tabs className="w-full font-bold" tabPosition="left" items={items} />
      </div>
    </div>
  );
};

export default Profile;
