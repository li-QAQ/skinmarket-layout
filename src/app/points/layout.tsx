'use client';
import { Button, Form, InputNumber, Segmented, Select, Space } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import PublishModal from './publish';

const { Item } = Form;

interface PointsProps {
  children?: React.ReactNode;
}
const Points = (props: PointsProps) => {
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
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="max-w-[1200px] mx-auto my-4 space-y-4">
      <div className="flex justify-between items-center">
        <Segmented
          style={{
            padding: '4px 8px',
          }}
          size="large"
          value={pahtname}
          onChange={(value) => router.push(value)}
          options={[
            {
              label: '購買',
              value: '/points',
            },
            {
              label: '出售',
              value: '/points/sell',
            },
          ]}
        />

        <PublishModal open={isOpen} setOpen={setIsOpen} />

        <Button
          type="primary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          發布
        </Button>
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

export default Points;
