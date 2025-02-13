'use client';
import './globals.css';
import LayoutMenu from '@/layout/Menu';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, Layout } from 'antd';
import theme from '@/theme/themeConfig';
import LayoutMenuMobile from '@/layout/LayoutMenuMobile';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Api from '@/api';
import { parseJwt } from '@/ultis/common';
import useInfoStore from '@/store/info';

const { Content } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = useSearchParams().get('token');
  const infoStore = useInfoStore();

  useEffect(() => {
    if (token) {
      const jwt = parseJwt(token);
      const memberId = jwt.payload.member_id;
      const merchantId = jwt.claims.iss.split('merchant: ')[1];

      infoStore.setToken(token);
      infoStore.setMemberId(memberId);
      infoStore.setMerchantId(merchantId);

      localStorage.setItem('token', token);
      localStorage.setItem('member_id', memberId);
      localStorage.setItem('merchant_id', merchantId);
    }
  }, [token]);

  useEffect(() => {
    Api.Member.get_info().then((res) => {
      infoStore.setPoint(res.data.point);
    });
  }, [infoStore.token]);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <div className="flex flex-col h-screen space-y-4">
              <Layout>
                <div className="max-md:hidden">
                  <LayoutMenu />
                </div>
                <div className="h-20 md:hidden">
                  <LayoutMenuMobile />
                </div>

                <Content>
                  <div
                    style={{
                      height: 'calc(100% - 96px)',
                    }}
                  >
                    {children}
                  </div>
                </Content>
              </Layout>
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
