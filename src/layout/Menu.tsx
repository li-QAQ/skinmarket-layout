"use client";
import { Button } from "antd";
import { usePathname, useRouter } from "next/navigation";

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

  const hanldleClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="h-20 w-full  px-8 flex items-center bg-[var(--secondary)] space-x-4">
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
          <Button type="primary" size="middle">
            登入
          </Button>
        </div>
      </div>
      {/* max-md:hidden */}
    </div>
  );
};

export default LayoutMenu;
