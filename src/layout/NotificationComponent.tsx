'use client';
import { Badge, Popover, List, Typography, Spin, Button, Drawer } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { formatNumber } from '@/ultis/common';
import Api from '@/api';
import dayjs from 'dayjs';

const { Text } = Typography;

interface NotificationComponentProps {
  isMobile?: boolean;
}

interface NotificationData {
  id: string;
  member_id: string;
  is_read: boolean;
  data: {
    Buyer: null;
    BuyerID: string;
    CreatedAt: string;
    DeletedAt: null;
    ID: number;
    ProofImage: string;
    Quantity: number;
    ReferenceID: number;
    ReferenceType: string;
    Seller: null;
    SellerID: string;
    Status: number;
    TotalPrice: string;
    UpdatedAt: string;
    Version: number;
  };
  created_at: string;
}

const NotificationComponent = ({
  isMobile = false,
}: NotificationComponentProps) => {
  const router = useRouter();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch transaction notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await Api.Member.get_notification();
        if (response?.data) {
          if (response.data.data === null) {
            setNotifications([]);
          } else {
            setNotifications(response.data.data);
          }

          setUnreadCount(response.data.extra.unread_count);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: number) => {
    if (status === 0) {
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    }
    if (status === 2) {
      return <CloseOutlined style={{ color: '#faad14' }} />;
    }
    if (status === 3) {
      return <LoadingOutlined style={{ color: '#1890ff' }} />;
    }
    if (status === 4) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
  };

  const getStatusText = (status: number) => {
    if (status === 0) {
      return '等待上傳付款證明';
    }
    if (status === 2) {
      return '對方已取消';
    }
    if (status === 3) {
      return '付款證明審核中';
    }
    if (status === 4) {
      return '確認付款';
    }
    return '已確認';
  };

  // Mark notifications as read
  const markAsRead = async (notificationIds: string[]) => {
    try {
      await Api.Member.patch_notification_mark_read({
        notification_ids: notificationIds,
      });
      // Refresh notifications to update read status and unread count
      const response = await Api.Member.get_notification();
      if (response?.data) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.extra.unread_count);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await Api.Member.patch_notification_mark_all_read();
      // Refresh notifications to update read status and unread count
      const response = await Api.Member.get_notification();
      if (response?.data) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.extra.unread_count);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    // Mark the notification as read
    markAsRead([notification.id]);

    setNotificationVisible(false);
    if (notification.data.ReferenceType === 'PointAcquisition') {
      router.push('/point/transaction/buyer/request');
    } else {
      router.push('/point/transaction/seller/request');
    }
  };

  const notificationContent = (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="p-2 border-b border-gray-700 flex justify-between items-center">
        <Text strong className="text-white">
          交易通知
        </Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={markAllAsRead}
            className="text-blue-400 hover:text-blue-300"
          >
            全部標為已讀
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin />
        </div>
      ) : notifications?.length === 0 ? (
        <div className="p-4 text-center text-gray-400">沒有待處理的交易</div>
      ) : (
        <List
          size="small"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-800 p-2 ${item.is_read ? 'opacity-70' : ''}`}
              onClick={() => handleNotificationClick(item)}
            >
              <div className="flex items-center w-full">
                <div className="mr-2">{getStatusIcon(item.data.Status)}</div>
                <div className="flex-1">
                  <div className="text-white text-sm">
                    {item.data.ReferenceType === 'PointAcquisition'
                      ? '購買請求'
                      : '出售請求'}
                    {!item.is_read && (
                      <span className="ml-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {getStatusText(item.data.Status)}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">
                    {formatNumber(item.data.Quantity)} 點
                  </div>
                  <div className="text-gray-400 text-xs">
                    NT$ {formatNumber(parseFloat(item.data.TotalPrice))}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  // Mobile notification drawer content
  const mobileNotificationContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#121212] to-[#1a1a1a]">
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin />
        </div>
      ) : notifications?.length === 0 ? (
        <div className="p-4 text-center text-gray-400">沒有待處理的交易</div>
      ) : (
        <>
          {unreadCount > 0 && (
            <div className="p-2 border-b border-gray-800 flex justify-end">
              <Button
                type="link"
                size="small"
                onClick={markAllAsRead}
                className="text-blue-400 hover:text-blue-300"
              >
                全部標為已讀
              </Button>
            </div>
          )}
          <List
            size="small"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-800 p-3 border-b border-gray-800 ${item.is_read ? 'opacity-70' : ''}`}
                onClick={() => handleNotificationClick(item)}
              >
                <div className="flex items-center w-full">
                  <div className="mr-3">{getStatusIcon(item.data.Status)}</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">
                      {item.data.ReferenceType === 'PointAcquisition'
                        ? '購買請求'
                        : '出售請求'}
                      {!item.is_read && (
                        <span className="ml-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {getStatusText(item.data.Status)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">
                      {formatNumber(item.data.Quantity)} 點
                    </div>
                    <div className="text-gray-400 text-xs">
                      NT$ {formatNumber(parseFloat(item.data.TotalPrice))}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Badge
          count={unreadCount}
          size="small"
          offset={[-2, 2]}
          className="notification-badge"
        >
          <Button
            type="text"
            icon={<BellOutlined className="text-white text-lg" />}
            onClick={() => setNotificationVisible(true)}
            className="flex items-center justify-center p-1"
          />
        </Badge>

        <Drawer
          title="交易通知"
          placement="right"
          onClose={() => setNotificationVisible(false)}
          open={notificationVisible}
          width="85%"
          styles={{
            body: {
              padding: 0,
            },
            header: {
              backgroundColor: '#121212',
              color: 'white',
              borderBottom: '1px solid #333',
            },
            mask: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
          rootClassName="md:hidden"
        >
          {mobileNotificationContent}
        </Drawer>
      </>
    );
  }

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      open={notificationVisible}
      onOpenChange={setNotificationVisible}
      placement="bottomRight"
      overlayClassName="notification-popover"
    >
      <div className="cursor-pointer">
        <div className="flex items-center space-x-2 bg-[#ffffff15] hover:bg-[#ffffff20] transition-all duration-200 px-3 py-1.5 rounded-lg">
          <Badge
            count={unreadCount}
            size="small"
            offset={[-2, 2]}
            className="notification-badge"
          >
            <BellOutlined className="text-white" />
          </Badge>
        </div>
      </div>
    </Popover>
  );
};

export default NotificationComponent;
