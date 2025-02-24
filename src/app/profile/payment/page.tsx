'use client';
import { Button, message, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import AddPayment from '../AddPayment';
import Api from '@/api';

const ProfilePayment = () => {
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [data, setData] = useState<any[]>([]);

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
          <Button type="primary" onClick={() => setIsOpenPayment(true)}>
            添加收款方式
          </Button>
        </div>
      </div>

      <div>
        <Table
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
              dataIndex: 'account_number',
              key: 'account_number',
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
                  <Button type="primary">編輯</Button>
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
