'use client';
import { useState } from 'react';
import KYCModal from '../kyc';
import { Avatar, Button } from 'antd';

const ProfileInfo = () => {
  const [isOpenKYC, setIsOpenKYC] = useState(false);

  return (
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
          <div className="basis-1/6">姓名</div>
          <div className="basis-5/6">小明</div>
        </div>
        <div className="flex space-x-20 items-center">
          <div className="basis-1/6">手機號碼</div>
          <div className="basis-5/6">0979221112</div>
        </div>
        <div className="flex space-x-20 items-center">
          <div className="basis-1/6">居住地址</div>
          <div className="basis-5/6">翻斗花園四號街2樓</div>
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
  );
};

export default ProfileInfo;
