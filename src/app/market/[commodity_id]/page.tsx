'use client';
import { Button, Card, Tabs, TabsProps, Tag, theme } from 'antd';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Commodities from './commodities';
import Record from './Record';

const { useToken } = theme;

const Commodity = ({}) => {
  const param = useParams();
  const router = useRouter();
  const commodity_id =
    typeof param.commodity_id === 'string'
      ? parseInt(param.commodity_id, 10)
      : NaN;

  const { token } = useToken();

  useEffect(() => {
    if (isNaN(commodity_id)) {
      router.push('/market');
    }
  }, [commodity_id]);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    { key: '1', label: '當前在售', children: <Commodities /> },
    { key: '2', label: '成交紀錄', children: <Record /> },
  ];

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Card className="w-full">
        <div className="flex justify-between">
          <div className="flex space-x-10 ">
            <Image src="/images/aug.png" alt="AUG" width={144} height={144} />
            <div className="space-y-2 flex flex-col justify-center">
              <div className="text-2xl">商品名稱</div>
              <div>
                <Tag>標籤1</Tag>
                <Tag>標籤2</Tag>
                <Tag>標籤3</Tag>
              </div>
              <div className="text-lg space-x-2">
                <span className="text-sm">參考價</span>
                <span
                  className="text-lg"
                  style={{
                    color: token.colorPrimary,
                  }}
                >
                  $100
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Button type="primary" size="large">
              我要出售
            </Button>
          </div>
        </div>
      </Card>
      <Card className="w-full">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Card>
    </div>
  );
};

export default Commodity;
