'use client';
import './globals.css';
import LayoutMenu from '@/layout/Menu';
import { Layout, message } from 'antd';
import { useEffect } from 'react';
import useMessageStore from '@/store/message';

const { Content } = Layout;

export default function ChildrenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [messageApi, contextHolder] = message.useMessage();
  const data = useMessageStore((state) => state.data);
  const setData = useMessageStore((state) => state.setData);

  useEffect(() => {
    if (data.content) {
      if (data.type === 'success') {
        messageApi.success(data.content);
      } else if (data.type === 'error') {
        messageApi.error(data.content);
      } else if (data.type === 'info') {
        messageApi.info(data.content);
      } else if (data.type === 'warning') {
        messageApi.warning(data.content);
      }
    }
    setData({ show: false, type: '', content: '' });
  }, [data.show]);

  return (
    <div className="flex flex-col h-screen space-y-4 ">
      {contextHolder}

      <Layout>
        <div>
          <LayoutMenu />
        </div>
        <Content>
          <div
            style={{
              height: 'calc(100% - 96px)',
            }}
            className="max-md:px-2"
          >
            {children}
          </div>
        </Content>
      </Layout>
    </div>
  );
}
