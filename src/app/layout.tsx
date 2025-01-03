import FilterTag from "@/components/FIlterTag";
import "./globals.css";
import LayoutMenu from "@/layout/Menu";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";

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
              <LayoutMenu />

              <div
                className="mx-8 flex"
                style={{
                  height: "calc(100% - 4rem)",
                }}
              >
                <div className="max-md:hidden mr-4">
                  <FilterTag />
                </div>
                <div
                  className="w-full h-full overflow-auto"
                  style={{
                    scrollbarWidth: "none",
                  }}
                >
                  {children}
                </div>
              </div>
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
