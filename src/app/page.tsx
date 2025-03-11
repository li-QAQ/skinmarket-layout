'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/point/trade');
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div>驗證登入……</div>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    </div>
  );
}
