'use client';
import { Button, Form, InputNumber, Segmented, Select, Space } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import BuyPublishModal from './buyPublish';
import SellPublishModal from './sellPublish';

const { Item } = Form;
interface TradeProps {
  children?: React.ReactNode;
}
const Trade = (props: TradeProps) => {
  const pahtname = usePathname();
  const router = useRouter();
  const [pays, setPays] = useState<string[]>(['All']);
  const handleChange = (value: string[]) => {
    const isAll = value.includes('All');

    if (isAll && value.length > 1) {
      setPays(value.filter((v) => v !== 'All'));
    } else {
      setPays(value);
    }
  };
  const handleClick = (pay: string) => {
    if (pay === 'All') {
      setPays(['All']);
    }
  };
  const [openBuy, setOpenBuy] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const options = [
    {
      label: '所有支付方式',
      value: 'All',
    },
    {
      label: '銀行支付',
      value: 'Bank',
    },
    {
      label: 'Line Pay',
      value: 'LinePay',
    },
    {
      label: '街口支付',
      value: 'JKOPay',
    },
  ];
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
            disabled
            type="primary"
            onClick={() => {
              setOpenBuy(true);
            }}
          >
            購買點數(需完成店家認證)
          </Button>
          {/* <Button
            type="primary"
            onClick={() => {
              setOpenBuy(true);
            }}
          >
            購買點數
          </Button> */}
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

      <Form layout="horizontal" className="flex space-x-4">
        <Item noStyle className="w-80">
          <InputNumber placeholder="交易點數" />
        </Item>
        <Item noStyle>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="支付方式"
            value={pays}
            onChange={handleChange}
            onSelect={handleClick}
            options={options}
            optionRender={(option) => <Space>{option.label}</Space>}
          />
        </Item>
      </Form>

      {props.children}
    </div>
  );
};

export default Trade;
