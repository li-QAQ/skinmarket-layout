'use client';
import { Button, Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import BuyPublishModal from './buyPublish';
import SellPublishModal from './sellPublish';

interface TradeProps {
  children?: React.ReactNode;
}
const Trade = (props: TradeProps) => {
  const pahtname = usePathname();
  const router = useRouter();

  const [openBuy, setOpenBuy] = useState(false);
  const [openSell, setOpenSell] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Segmented
          value={pahtname}
          onChange={(value) => router.push(value)}
          options={[
            {
              label: '購買',
              value: '/point/trade',
            },
            {
              label: '出售',
              value: '/point/trade/sell',
            },
          ]}
        />

        <BuyPublishModal open={openBuy} setOpen={setOpenBuy} />
        <SellPublishModal open={openSell} setOpen={setOpenSell} />

        <div className="space-x-4">
          <Button
            type="primary"
            onClick={() => {
              setOpenBuy(true);
            }}
          >
            購買點數
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setOpenSell(true);
            }}
          >
            出售點數
          </Button>
        </div>
      </div>

      {props.children}
    </div>
  );
};

export default Trade;
