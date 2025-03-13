'use client';
import {
  Button,
  Empty,
  Skeleton,
  Space,
  Tour,
  Typography,
  Popconfirm,
} from 'antd';
import { useEffect, useRef, useState, useCallback } from 'react';
import AddPayment from '../AddPayment';
import Api from '@/api';
import useTourStore from '@/store/tour';
import { TourProps } from 'antd/lib';
import ResponsiveTable from '@/components/ResponsiveTable';
import { DeleteOutlined, BankOutlined, PlusOutlined } from '@ant-design/icons';
import useMessageStore from '@/store/message';

const { Title, Text, Paragraph } = Typography;

const ProfilePayment = () => {
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const setMessage = useMessageStore((state) => state.setData);

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

  const fetchBankData = useCallback(() => {
    setLoading(true);
    Api.Member.get_bank()
      .then((res: any) => {
        setData(res.data || []);
      })
      .catch((error) => {
        setMessage({
          show: true,
          content: '獲取收款方式失敗',
          type: 'error',
        });
        console.error('Failed to fetch bank data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle successful payment method addition
  const handlePaymentAdded = useCallback(() => {
    fetchBankData();
    setMessage({
      show: true,
      content: '收款方式添加成功',
      type: 'success',
    });
  }, [fetchBankData]);

  useEffect(() => {
    fetchBankData();
  }, [fetchBankData]);

  const handleDelete = (id: number) => {
    Api.Member.del_bank(id)
      .then(() => {
        setData(data.filter((item) => item.id !== id));
        setMessage({
          show: true,
          content: '刪除成功',
          type: 'success',
        });
      })
      .catch(() => {
        setMessage({
          show: true,
          content: '刪除失敗',
          type: 'error',
        });
      });
  };

  const columns = [
    {
      title: '收款方式',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: () => (
        <div className="flex items-center">
          <BankOutlined className="mr-2 text-blue-400" />
          <span>境內銀行</span>
        </div>
      ),
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
      render: (text: string) => <span className="font-mono">{text}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="確定要刪除此收款方式嗎？"
            description="刪除後無法恢復，需要重新添加。"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              刪除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Title level={4} className="mb-6">
        收款方式
      </Title>

      <div className="bg-white/5 rounded-lg p-4 md:p-6 space-y-6 shadow-sm">
        {/* Description and Add Button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <Paragraph className="text-sm text-gray-400 md:max-w-[70%] mb-0">
            收款方式：您添加的C2C收款方式將在C2C交易出售數字貨幣時向買方展示作為您的收款方式，請務必使用您本人的實名賬戶確保買方可以順利給您轉帳。您最多可添加20種收款方式。
          </Paragraph>

          <div className="flex justify-start md:justify-end">
            <AddPayment
              open={isOpenPayment}
              setOpen={setIsOpenPayment}
              onSuccess={handlePaymentAdded}
            />
            <Button
              ref={ref1}
              type="primary"
              onClick={() => setIsOpenPayment(true)}
              className="w-full md:w-auto"
              icon={<PlusOutlined />}
              size="middle"
            >
              添加收款方式
            </Button>
          </div>
        </div>

        <Tour
          open={bankTour}
          onClose={() => setBankTour(false)}
          steps={steps}
        />

        {/* Payment Methods Table */}
        {loading ? (
          <div className="space-y-4 py-4">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : data.length > 0 ? (
          <div className="mt-4">
            <ResponsiveTable
              rowKey="id"
              columns={columns}
              dataSource={data}
              breakpoint={768}
              mobileOrder={[
                'payment_method',
                'bank_name',
                'bank_code',
                'account_number',
                'action',
              ]}
              pagination={false}
              cardRender={(item) => (
                <div className="space-y-3 p-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BankOutlined className="mr-2 text-blue-400" />
                      <Text strong>境內銀行</Text>
                    </div>
                    <Popconfirm
                      title="確定要刪除此收款方式嗎？"
                      description="刪除後無法恢復，需要重新添加。"
                      onConfirm={() => handleDelete(item.id)}
                      okText="確定"
                      cancelText="取消"
                    >
                      <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                      >
                        刪除
                      </Button>
                    </Popconfirm>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <Text type="secondary" className="text-xs block">
                        銀行名稱
                      </Text>
                      <Text>{item.bank_name}</Text>
                    </div>
                    <div>
                      <Text type="secondary" className="text-xs block">
                        銀行代碼
                      </Text>
                      <Text>{item.bank_code}</Text>
                    </div>
                    <div className="col-span-2">
                      <Text type="secondary" className="text-xs block">
                        收款賬號
                      </Text>
                      <Text className="font-mono">{item.account_number}</Text>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">
                尚未添加收款方式，請點擊添加收款方式按鈕進行添加
              </Text>
            }
            className="my-12"
          ></Empty>
        )}
      </div>
    </div>
  );
};

export default ProfilePayment;
