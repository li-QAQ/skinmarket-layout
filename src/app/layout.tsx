'use client';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';

import zhTW from 'antd/locale/zh_TW';
import AuthHandler from '@/hook/AuthHandler';
import { Suspense } from 'react';
import ChildrenLayout from './childLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
              <ConfigProvider locale={zhTW}>
                <AuthHandler />
                <ChildrenLayout>{children}</ChildrenLayout>
              </ConfigProvider>
            </ConfigProvider>
          </AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
