'use client';
import Api from '@/api';
import useInfoStore from '@/store/info';
import useMessageStore from '@/store/message';
import { formatNumber } from '@/ultis/common';
import {
  Button,
  Popconfirm,
  Tag,
  Typography,
  Space,
  Tooltip,
  Badge,
  Modal,
  Image,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const RequestPage = () => {
  const member_id = useInfoStore((state) => state.member_id);
  const setMessage = useMessageStore((state) => state.setData);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentProofImage, setCurrentProofImage] = useState('');

  // 处理查看付款证明
  const handleViewProofImage = (proofImage: string) => {
    if (!proofImage) {
      setMessage({
        show: true,
        content: '付款證明不存在',
        type: 'error',
      });
      return;
    }

    setCurrentProofImage(proofImage);
    setImageModalVisible(true);
  };

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
        <Text type="success" strong>
          NT ${formatNumber(total_price)}
        </Text>
      ),
      align: 'right',
      sorter: (a: any, b: any) => a.total_price - b.total_price,
    },
    {
      title: '買家',
      dataIndex: 'buyer_id',
      render: (buyer_id: string) => (
        <Tooltip title="買家ID">
          <Text>{buyer_id}</Text>
        </Tooltip>
      ),
    },
    {
      title: '付款證明',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return (
          <Space>
            {getStatusTag(record.status)}
            {record.status >= 3 && (
              <Tooltip title="查看付款證明">
                <Badge dot={record.status === 3}>
                  <FileImageOutlined
                    style={{ fontSize: '16px', cursor: 'pointer' }}
                    onClick={() => handleViewProofImage(record.proof_image)}
                  />
                </Badge>
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
        if (record.seller_id == member_id) {
          return (
            <Space size="small">
              <Popconfirm
                title="確認收款"
                description={
                  record.status < 3
                    ? '買家尚未上傳付款證明，確定要強制確認收款嗎？'
                    : '確認已收到款項？此操作不可逆'
                }
                okText="確認"
                cancelText="取消"
                okButtonProps={{
                  type: 'primary',
                  danger: record.status < 3,
                }}
                icon={
                  record.status < 3 ? (
                    <ExclamationCircleOutlined style={{ color: 'red' }} />
                  ) : (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                  )
                }
                onConfirm={() => {
                  setLoading(true);
                  Api.Member.patch_point_confirm(record.id, 1)
                    .then(() => {
                      Api.Member.get_point_confirm_seller().then((res) => {
                        setData(res.data);
                        setMessage({
                          show: true,
                          content: '確認收款成功',
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
                  danger={record.status < 3}
                  icon={<CheckCircleOutlined />}
                >
                  {record.status < 3 ? '強制確認收款' : '確認收款'}
                </Button>
              </Popconfirm>

              {record.reference_type === 'PointAcquisition' &&
                record.status === 0 && (
                  <Popconfirm
                    title="撤回請求"
                    description="確定要撤回此請求嗎？此操作不可逆"
                    okText="撤回"
                    cancelText="取消"
                    icon={
                      <ExclamationCircleOutlined style={{ color: 'red' }} />
                    }
                    onConfirm={() => {
                      setLoading(true);
                      Api.Member.del_point_confirm(record.id)
                        .then(() => {
                          Api.Member.get_point_confirm_seller().then((res) => {
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

              {record.reference_type === 'PointOrder' &&
                record.status === 0 && (
                  <Popconfirm
                    title="拒絕請求"
                    description="確定要拒絕此訂單請求嗎？此操作不可逆"
                    okText="拒絕"
                    cancelText="取消"
                    icon={
                      <ExclamationCircleOutlined style={{ color: 'red' }} />
                    }
                    onConfirm={() => {
                      setLoading(true);
                      Api.Member.patch_point_confirm(record.id, 2)
                        .then(() => {
                          Api.Member.get_point_confirm_seller().then((res) => {
                            setData(res.data);
                            setMessage({
                              show: true,
                              content: '拒絕訂單請求成功',
                              type: 'success',
                            });
                            setLoading(false);
                          });
                        })
                        .catch(() => {
                          setLoading(false);
                        });
                    }}
                    disabled={record.status === 3}
                  >
                    <Button
                      disabled={record.status === 3}
                      type="primary"
                      danger
                      icon={<CloseCircleOutlined />}
                    >
                      拒絕請求
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
      proof_image?: string;
    }[]
  >();

  useEffect(() => {
    setLoading(true);
    Api.Member.get_point_confirm_seller()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // 构建完整的图片URL
  const getFullImageUrl = (path: string) => {
    if (!path) return '';

    // 检查是否已经是完整URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // 根据您的API配置构建URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${baseUrl}/${path}`;
  };

  return (
    <div className="mt-4">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div className="flex justify-between items-center">
          <Title level={4} style={{ margin: 0 }}>
            賣出請求列表
          </Title>
          <Button
            onClick={() => {
              setLoading(true);
              Api.Member.get_point_confirm_seller()
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

      {/* 付款证明查看模态框 */}
      <Modal
        title="付款證明"
        open={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="flex justify-center">
          {currentProofImage ? (
            <Image
              src={getFullImageUrl(currentProofImage)}
              alt="付款證明"
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
            />
          ) : (
            <div className="flex justify-center items-center">
              <LoadingOutlined style={{ fontSize: 24 }} spin />
              <span className="ml-2">加載圖片中...</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RequestPage;
