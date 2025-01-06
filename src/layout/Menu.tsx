"use client";
import LoginModal from "@/components/Login";
import useAuthStore from "@/store/auth";
import { Avatar, Button, Dropdown } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const LayoutMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const itmes = [
    {
      label: "市場",
      path: "/",
    },
    {
      label: "背包",
      path: "/bag",
    },
    {
      label: "出售管理",
      path: "/sell",
    },
    {
      label: "訂單管理",
      path: "/order",
    },
  ];
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const { isLogin, setLogin } = useAuthStore();

  const hanldleClick = (path: string) => {
    router.push(path);
  };

  const hanldleLogin = () => {
    setLogin(false);
  };

  const menuItems: any = [
    {
      key: "profile",
      label: "個人資料",
      icon: <UserOutlined />,
      onClick: () => {
        router.push("/profile");
      },
    },
    {
      key: "signOut",
      label: "登出",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("token");
        setLogin(false);
        router.push("/");
      },
    },
  ];

  return (
    <div className="h-full w-full px-8 flex items-center bg-[var(--secondary)] space-x-4">
      <div>
        <div className="w-52 font-bold text-center">LOGO</div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex space-x-8 font-bold text-sm">
          {itmes.map((item, index) => {
            return (
              <div
                key={index}
                className="cursor-pointer hover:text-white"
                onClick={() => hanldleClick(item.path)}
                style={{
                  borderBottom:
                    pathname === item.path ? "2px solid white" : "none",
                }}
              >
                <div>{item.label}</div>
              </div>
            );
          })}
        </div>
        <div>
          <LoginModal
            open={isOpenLogin}
            setOpen={(open) => {
              setIsOpenLogin(open);
            }}
          />

          {isLogin ? (
            <Dropdown menu={{ items: menuItems }} className="cursor-pointer ">
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          ) : (
            <Button
              type="primary"
              size="middle"
              onClick={() => setIsOpenLogin(true)}
            >
              登入
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutMenu;
