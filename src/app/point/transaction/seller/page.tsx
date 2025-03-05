'use client';
import Api from '@/api';
import useInfoStore from '@/store/info';
import { ThousandSymbolFormat } from '@/ultis/common';
import { Button, message, Popconfirm, Segmented, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const FailedPointTransactionPage = () => {
  const member_id = useInfoStore((state) => state.member_id);
  const [identity, setIdentity] = useState('request');
  const requestColumns: any = [
    {
      title: '訂單編號',
      dataIndex: 'id',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      render: (quantity: number) => ThousandSymbolFormat(quantity),
      align: 'right',
    },
    {
      title: '單價',
      dataIndex: 'price',
      render: (_: any, record: any) =>
        `NT ${(record.total_price / record.quantity).toFixed(2)}`,
      align: 'right',
    },
    {
      title: '合計',
      dataIndex: 'total_price',
      render: (total_price: number) =>
        `NT ${ThousandSymbolFormat(total_price)}`,
      align: 'right',
    },
    {
      title: '賣家',
      dataIndex: 'seller_id',
    },
    {
      title: '買家',
      dataIndex: 'buyer_id',
    },
    {
      title: '日期',
      dataIndex: 'created_at',
      render: (created_at: string) =>
        dayjs(created_at).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 320,
      render: (_: any, record: any) => {
        const rejectStatus = record.status === 3 || record.status === 0;
        if (record.seller_id == member_id) {
          return (
            <div className="flex space-x-4 items-center">
              <Popconfirm
                title="確定要確認此筆交易嗎?"
                description="此操作不可逆"
                okText="是"
                cancelText="否"
                onConfirm={() => {
                  Api.Member.patch_point_confirm(record.id, 1).then(() => {
                    Api.Member.get_point_confirm_seller().then((res) => {
                      setData(res.data);

                      message.success('確認收款成功');
                    });
                  });
                }}
              >
                <Button type="primary">
                  {record.status === 0 && '強制確認收款'}
                  {record.status === 3 && '強制確認收款'}
                  {record.status === 4 && '確認收款'}
                </Button>
              </Popconfirm>

              {record.reference_type === 'PointAcquisition' &&
                record.status === 0 && (
                  <Popconfirm
                    title="確定要撤回此請求嗎?"
                    description="此操作不可逆"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => {
                      Api.Member.del_point_confirm(record.id).then(() => {
                        Api.Member.get_point_confirm_seller().then((res) => {
                          setData(res.data);

                          message.success('撤回請求成功');
                        });
                      });
                    }}
                  >
                    <Button type="primary" danger>
                      撤回請求
                    </Button>
                  </Popconfirm>
                )}

              {record.reference_type === 'PointOrder' && (
                <Button
                  disabled={rejectStatus}
                  type="primary"
                  danger
                  onClick={() => {
                    Api.Member.patch_point_confirm(record.id, 2).then(() => {
                      Api.Member.get_point_confirm_seller().then((res) => {
                        setData(res.data);

                        message.success('拒絕訂單請求');
                      });
                    });
                  }}
                >
                  {rejectStatus ? '' : '拒絕請求'}
                  {record.status === 0 && '(未上傳付款證明)'}
                  {record.status === 3 && '(付款證明審核中)'}
                </Button>
              )}
            </div>
          );
        }
      },
    },
  ];

  const failedColumns: any = [
    {
      title: '訂單編號',
      dataIndex: 'id',
    },
    {
      title: '交易編號',
      dataIndex: 'reference_id',
    },
    {
      title: '失敗原因',
      dataIndex: 'reference_type',
      render: (reference_type: string, record: any) => {
        if (reference_type === 'PointOrder' && member_id === record.seller_id) {
          return '被我取消';
        }

        if (
          reference_type === 'PointAcquisition' &&
          member_id === record.seller_id
        ) {
          return '對方取消';
        }

        return '未知原因';
      },
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      render: (quantity: number) => ThousandSymbolFormat(quantity),
      align: 'right',
    },
    {
      title: '總額',
      dataIndex: 'total_price',
      render: (total_price: number) =>
        `NT ${ThousandSymbolFormat(total_price)}`,
      align: 'right',
    },
    {
      title: '賣家',
      dataIndex: 'seller_id',
    },
    {
      title: '買家',
      dataIndex: 'buyer_id',
    },
    {
      title: '日期',
      dataIndex: 'created_at',
      width: 200,
      render: (created_at: string) =>
        dayjs(created_at).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const [data, setData] = useState<
    {
      id: number;
      price: number;
      quantity: number;
      trader: string;
      action: number;
      created_at: string;
      status: number;
    }[]
  >();

  useEffect(() => {
    if (identity === 'request') {
      Api.Member.get_point_confirm_seller().then((res) => {
        setData(res.data);
      });
    } else {
      Api.Member.get_point_confirm_failed_seller().then((res) => {
        setData(res.data);
      });
    }
  }, [identity]);

  return (
    <>
      <Segmented
        value={identity}
        options={[
          {
            value: 'request',
            label: '請求中',
          },
          {
            value: 'failed',
            label: '失敗記錄',
          },
        ]}
        onChange={(value) => setIdentity(value)}
      />
      {identity === 'request' && (
        <Table
          pagination={{
            pageSize: 8,
          }}
          rowKey="id"
          dataSource={data}
          columns={requestColumns}
        />
      )}

      {identity === 'failed' && (
        <Table
          pagination={{
            pageSize: 8,
          }}
          rowKey="id"
          dataSource={data}
          columns={failedColumns}
        />
      )}
    </>
  );
};

export default FailedPointTransactionPage;
