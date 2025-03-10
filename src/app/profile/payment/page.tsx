'use client';
import { Button, message, Space, Tour } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddPayment from '../AddPayment';
import Api from '@/api';
import useTourStore from '@/store/tour';
import { TourProps } from 'antd/lib';
import ResponsiveTable from '@/components/ResponsiveTable';

const ProfilePayment = () => {
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const bankTour: boolean = useTourStore((state) => state.bankTour);
  const setBankTour = useTourStore((state) => state.setBankTour);
  const ref1 = useRef(null);
  const steps: TourProps['steps'] = [
    {
      title: '添加收款方式',
      description: '點擊"添加收款方式"按鈕進行添加。',
      target: () => ref1.current,
    },
  ];

  useEffect(() => {
    Api.Member.get_bank().then((res: any) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="font-black text-xl">收款方式</div>
      <div className="flex justify-between">
        <div className="w-[700px] text-sm  text-gray-500">
          收款方式：您添加的C2C收款方式將在C2C交易出售數字貨幣時向買方展示作為您的收款方式，請務必使用您本人的實名賬戶確保買方可以順利給您轉帳。您最多可添加20種收款方式。
        </div>

        <div className="flex justify-end">
          <AddPayment open={isOpenPayment} setOpen={setIsOpenPayment} />
          <Button
            ref={ref1}
            type="primary"
            onClick={() => setIsOpenPayment(true)}
          >
            添加收款方式
          </Button>
        </div>
      </div>

      <Tour open={bankTour} onClose={() => setBankTour(false)} steps={steps} />

      <div>
        <ResponsiveTable
          rowKey="id"
          columns={[
            {
              title: '收款方式',
              dataIndex: 'payment_method',
              key: 'payment_method',
              render: () => <div>境內銀行</div>,
            },
            {
              title: '銀行名稱',
              dataIndex: 'bank_name',
              key: 'bank_name',
            },
            {
              title: '銀行代碼',
              dataIndex: 'bank_code',
              key: 'bank_code',
            },
            {
              title: '收款賬號',
              dataIndex: 'account_number',
              key: 'account_number',
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              render: (_: any, record) => (
                <Space size="middle">
                  {/* <Button type="primary">編輯</Button> */}
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      Api.Member.del_bank(record.id).then(() => {
                        setData(data.filter((item) => item.id !== record.id));

                        message.success('刪除成功');
                      });
                    }}
                  >
                    刪除
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={data}
        />
      </div>
    </div>
  );
};

export default ProfilePayment;
