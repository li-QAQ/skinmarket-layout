"use client";
import "./globals.css";
import LayoutMenu from "@/layout/Menu";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import LayoutMenuMobile from "@/layout/LayoutMenuMobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <div className="flex flex-col h-screen space-y-4">
              <div className="h-20 max-md:hidden">
                <LayoutMenu />
              </div>
              <div className="h-20 md:hidden">
                <LayoutMenuMobile />
              </div>
              <div
                className="mx-8"
                style={{
                  height: "calc(100% - 96px)",
                }}
              >
                {children}
              </div>
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
