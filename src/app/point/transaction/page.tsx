'use client';
import Api from '@/api';
import useInfoStore from '@/store/info';
import { ThousandSymbolFormat } from '@/ultis/common';
import { Button, message, Popconfirm, Segmented, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import UploadReceipt from './UploadReceipt';

const RequestPointTransactionPage = () => {
  const member_id = useInfoStore((state) => state.member_id);
  const [identity, setIdentity] = useState('request');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmId, setConfirmId] = useState('');
  const [traderId, setTraderId] = useState();
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
      width: 280,
      render: (_: any, record: any) => {
        if (record.buyer_id == member_id) {
          return (
            <div className="flex space-x-4">
              {/* <Button
                type="primary"
                onClick={() => {
                  Api.Member.patch_point_confirm(record.id, 1).then(() => {
                    Api.Member.get_point_confirm_buyer().then((res) => {
                      setData(res.data);

                      message.success('確認訂單成功');
                    });
                  });
                }}
              >
                確認
              </Button> */}

              {record.status === 0 && (
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      // Api.Member.patch_point_confirm(record.id, 1).then(() => {
                      //   Api.Member.get_point_confirm_buyer().then((res) => {
                      //     setData(res.data);
                      //     message.success('確認訂單成功');
                      //   });
                      // });
                      setConfirmId(record.id);
                      setUploadOpen(true);
                      setTraderId(record.seller_id);
                    }} //Upload receipt
                  >
                    我要付款
                  </Button>
                </div>
              )}

              {record.status === 3 && (
                <div>
                  <Button disabled>審核中</Button>
                </div>
              )}

              {record.reference_type === 'PointAcquisition' && (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    Api.Member.patch_point_confirm(record.id, 2).then(() => {
                      Api.Member.get_point_confirm_buyer().then((res) => {
                        setData(res.data);
                        message.success('拒絕請求成功');
                      });
                    });
                  }}
                >
                  拒絕請求
                </Button>
              )}

              {record.reference_type === 'PointOrder' && (
                <Popconfirm
                  title="確定要取消此請求嗎?"
                  description="此操作不可逆"
                  okText="是"
                  cancelText="否"
                  onConfirm={() => {
                    Api.Member.del_point_confirm(record.id).then(() => {
                      Api.Member.get_point_confirm_buyer().then((res) => {
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
        if (reference_type === 'PointOrder' && member_id === record.buyer_id) {
          return '對方拒絕';
        }

        if (
          reference_type === 'PointAcquisition' &&
          member_id === record.buyer_id
        ) {
          return '被我拒絕';
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
      Api.Member.get_point_confirm_buyer().then((res) => {
        setData(res.data);
      });
    } else {
      Api.Member.get_point_confirm_failed_buyer().then((res) => {
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

      <UploadReceipt
        traderId={traderId}
        confirmId={confirmId}
        open={uploadOpen}
        setOpen={setUploadOpen}
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

export default RequestPointTransactionPage;
