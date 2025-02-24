'use client';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Api from '@/api';
import { parseJwt } from '@/ultis/common';
import useInfoStore from '@/store/info';
import ChildrenLayout from './childLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const login_token = useSearchParams().get('token') as string;
  const token = useInfoStore((state) => state.token);
  const setToken = useInfoStore((state) => state.setToken);
  const setMemberId = useInfoStore((state) => state.setMemberId);
  const setMerchantId = useInfoStore((state) => state.setMerchantId);
  const setPoint = useInfoStore((state) => state.setPoint);

  useEffect(() => {
    if (login_token) {
      const jwt = parseJwt(login_token);

      const memberId = jwt.jti;
      const merchantId = jwt.iss.split('merchant: ')[1];

      setMemberId(memberId);
      setMerchantId(merchantId);

      localStorage.setItem('member_id', memberId);
      localStorage.setItem('merchant_id', merchantId);

      Api.Auth.auth_login({
        id: memberId,
        login_token,
      }).then((res) => {
        const token = res.data.access_token;

        setToken(token);
        localStorage.setItem('token', token);
      });
    }
  }, [login_token]);

  useEffect(() => {
    if (token) {
      Api.Member.get_info().then((res) => {
        setPoint(res.data.point);
      });
    }
  }, [token]);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <ChildrenLayout>{children}</ChildrenLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
