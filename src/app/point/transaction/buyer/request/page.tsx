'use client';
import Api from '@/api';
import useInfoStore from '@/store/info';
import useMessageStore from '@/store/message';
import { formatNumber } from '@/ultis/common';
import { Button, Popconfirm, Typography, Space, Tooltip, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import UploadReceipt from '../../UploadReceipt';
import ResponsiveTable from '@/components/ResponsiveTable';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  LoadingOutlined,
  UploadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BuyerRequestPage = () => {
  const member_id = useInfoStore((state) => state.member_id);
  const setMessage = useMessageStore((state) => state.setData);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmId, setConfirmId] = useState('');
  const [traderId, setTraderId] = useState();
  const [loading, setLoading] = useState(true);

  const getStatusTag = (status: number) => {
    if (status === 0) {
      return (
        <Tag icon={<ExclamationCircleOutlined />} color="default">
          未上傳
        </Tag>
      );
    }

    if (status === 3) {
      return (
        <Tag icon={<LoadingOutlined />} color="warning">
          審核中
        </Tag>
      );
    }

    if (status === 4) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          已通過
        </Tag>
      );
    }
  };

  const requestColumns: any = [
    {
      title: '日期',
      dataIndex: 'created_at',
      render: (created_at: string) => (
        <Tooltip title={dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}>
          {dayjs(created_at).format('YYYY-MM-DD')}
        </Tooltip>
      ),
      sorter: (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: '訂單編號',
      dataIndex: 'id',
      render: (id: string) => <Text copyable>{id}</Text>,
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      render: (quantity: number) => (
        <Text strong>{formatNumber(quantity)}</Text>
      ),
      align: 'right',
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: '單價',
      dataIndex: 'price',
      render: (_: any, record: any) => (
        <Text>NT ${(record.total_price / record.quantity).toFixed(2)}</Text>
      ),
      align: 'right',
    },
    {
      title: '合計',
      dataIndex: 'total_price',
      render: (total_price: number) => (
        <Text type="danger" strong>
          NT ${formatNumber(total_price)}
        </Text>
      ),
      align: 'right',
      sorter: (a: any, b: any) => a.total_price - b.total_price,
    },
    {
      title: '賣家',
      dataIndex: 'seller_id',
      render: (seller_id: string) => (
        <Tooltip title="賣家ID">
          <Text>{seller_id}</Text>
        </Tooltip>
      ),
    },
    {
      title: '付款證明',
      dataIndex: 'status',
      render: (status: number) => {
        return (
          <Space>
            {getStatusTag(status)}
            {status >= 3 && (
              <Tooltip title="已上傳付款證明">
                <FileImageOutlined
                  style={{
                    fontSize: '16px',
                    color: status === 4 ? '#52c41a' : '#faad14',
                  }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
      filters: [
        { text: '未上傳', value: 0 },
        { text: '審核中', value: 3 },
        { text: '已通過', value: 4 },
      ],
      onFilter: (value: number, record: any) => record.status === value,
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 280,
      render: (_: any, record: any) => {
        if (record.buyer_id == member_id) {
          return (
            <Space size="small">
              {record.status === 0 && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => {
                    setConfirmId(record.id);
                    setUploadOpen(true);
                    setTraderId(record.seller_id);
                  }}
                >
                  我要付款
                </Button>
              )}

              {record.status === 3 && (
                <Tooltip title="付款證明審核中，請等待賣家確認">
                  <Button disabled icon={<LoadingOutlined />}>
                    審核中
                  </Button>
                </Tooltip>
              )}

              {record.reference_type === 'PointAcquisition' &&
                record.status === 0 && (
                  <Popconfirm
                    title="拒絕請求"
                    description="確定要拒絕此請求嗎？此操作不可逆"
                    okText="拒絕"
                    cancelText="取消"
                    icon={
                      <ExclamationCircleOutlined style={{ color: 'red' }} />
                    }
                    onConfirm={() => {
                      setLoading(true);
                      Api.Member.patch_point_confirm(record.id, 2)
                        .then(() => {
                          Api.Member.get_point_confirm_buyer().then((res) => {
                            setData(res.data);
                            setMessage({
                              show: true,
                              content: '拒絕請求成功',
                              type: 'success',
                            });
                            setLoading(false);
                          });
                        })
                        .catch(() => {
                          setLoading(false);
                        });
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<CloseCircleOutlined />}
                    >
                      拒絕請求
                    </Button>
                  </Popconfirm>
                )}

              {record.reference_type === 'PointOrder' &&
                record.status === 0 && (
                  <Popconfirm
                    title="撤回請求"
                    description="確定要取消此請求嗎？此操作不可逆"
                    okText="撤回"
                    cancelText="取消"
                    icon={
                      <ExclamationCircleOutlined style={{ color: 'red' }} />
                    }
                    onConfirm={() => {
                      setLoading(true);
                      Api.Member.del_point_confirm(record.id)
                        .then(() => {
                          Api.Member.get_point_confirm_buyer().then((res) => {
                            setData(res.data);
                            setMessage({
                              show: true,
                              content: '撤回請求成功',
                              type: 'success',
                            });
                            setLoading(false);
                          });
                        })
                        .catch(() => {
                          setLoading(false);
                        });
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<CloseCircleOutlined />}
                    >
                      撤回請求
                    </Button>
                  </Popconfirm>
                )}
            </Space>
          );
        }
      },
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
    setLoading(true);
    Api.Member.get_point_confirm_buyer()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-4">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className="flex justify-between items-center">
          <Title level={4} style={{ margin: 0 }}>
            購入請求列表
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setLoading(true);
              Api.Member.get_point_confirm_buyer()
                .then((res) => {
                  setData(res.data);
                  setLoading(false);
                  setMessage({
                    show: true,
                    content: '資料已更新',
                    type: 'success',
                  });
                })
                .catch(() => {
                  setLoading(false);
                });
            }}
          >
            刷新資料
          </Button>
        </div>

        <UploadReceipt
          traderId={traderId}
          confirmId={confirmId}
          open={uploadOpen}
          setOpen={setUploadOpen}
        />

        <ResponsiveTable
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total: number) => `共 ${total} 筆資料`,
          }}
          rowKey="id"
          dataSource={data as any}
          columns={requestColumns}
          scroll={{ x: 'max-content' }}
        />
      </Space>
    </div>
  );
};

export default BuyerRequestPage;
