'use client';

import { Card, Tag, Input, InputNumber } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';
import { numberCarry, formatNumber } from '@/ultis/common';
import dayjs from 'dayjs';

// Base interface for point order items
export interface BasePointOrderItem {
  description?: string;
  price: number;
  quantity: number;
}

// Extended interface with optional fields that might be present in different contexts
export interface PointOrderItem extends BasePointOrderItem {
  id?: number;
  member_id?: string;
  seller_id?: string;
  buyer_id?: string;
  status?: number;
  created_at?: string;
  total_price?: number;
  reference_type?: string;
  reference_id?: string;
}

export interface PointOrderCardProps {
  item: PointOrderItem;
  actionButton?: ReactNode;
  showMemberId?: boolean;
  showTotal?: boolean;
  showDescription?: boolean;
  showDate?: boolean;
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
  editable?: boolean;
  onQuantityChange?: (value: number | null) => void;
  onPriceChange?: (value: number | null) => void;
  onDescriptionChange?: (value: string) => void;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  additionalContent?: ReactNode;
}

const PointOrderCard = ({
  item,
  actionButton,
  showMemberId = true,
  showTotal = true,
  showDescription = true,
  showDate = false,
  showStatus = false,
  className = '',
  onClick,
  editable = false,
  onQuantityChange,
  onPriceChange,
  onDescriptionChange,
  headerContent,
  footerContent,
  additionalContent,
}: PointOrderCardProps) => {
  const isInfinite = item.quantity === -1;
  const memberId = item.member_id || item.seller_id;

  // Calculate total if not provided
  const totalPrice = item.total_price || item.price * item.quantity;

  // Get status text
  const getStatusText = (status?: number) => {
    if (status === undefined) return null;

    switch (status) {
      case 0:
        return <Tag color="processing">待處理</Tag>;
      case 1:
        return <Tag color="success">已完成</Tag>;
      case 2:
        return <Tag color="error">已拒絕</Tag>;
      case 3:
        return <Tag color="warning">審核中</Tag>;
      default:
        return <Tag color="default">未知狀態</Tag>;
    }
  };

  return (
    <Card
      className={`flex flex-col justify-end bg-[#1a1a1a] border-gray-800 hover:border-gray-700 transition-all duration-300 ${className} `}
      styles={{
        body: {
          padding: '16px',
        },
      }}
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        {showMemberId && memberId ? (
          <div className="flex items-center">
            <UserOutlined className="text-blue-500 mr-2" />
            <span className="text-white font-medium">{memberId}</span>
          </div>
        ) : headerContent ? (
          headerContent
        ) : null}

        <div className="flex items-center space-x-2">
          {isInfinite && (
            <Tag color="purple" className="flex items-center">
              <InfoCircleOutlined className="mr-1" /> 無限數量
            </Tag>
          )}
          {showStatus && getStatusText(item.status)}
        </div>
      </div>

      {/* Card Content */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#ffffff08] p-3 rounded-md">
          <div className="text-gray-400 text-xs mb-1 flex items-center">
            <ShoppingOutlined className="mr-1" />
            <span>數量</span>
          </div>
          {editable && onQuantityChange ? (
            <InputNumber
              className="w-full bg-[#2a2a2a] border-gray-700 text-white"
              value={item.quantity === -1 ? undefined : item.quantity}
              onChange={onQuantityChange}
              min={1}
              placeholder={isInfinite ? '無限' : '輸入數量'}
            />
          ) : (
            <div className="font-medium text-white">
              {isInfinite ? '∞' : formatNumber(item.quantity)}
            </div>
          )}
        </div>

        <div className="bg-[#ffffff08] p-3 rounded-md">
          <div className="text-gray-400 text-xs mb-1 flex items-center">
            <DollarOutlined className="mr-1" />
            <span>單價</span>
          </div>
          {editable && onPriceChange ? (
            <InputNumber
              className="w-full bg-[#2a2a2a] border-gray-700 text-white"
              value={item.price}
              onChange={onPriceChange}
              min={0.01}
              step={0.01}
              precision={2}
              addonBefore="NT$"
            />
          ) : (
            <div className="font-medium text-yellow-400">
              NT ${numberCarry(item.price, 2).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {showDescription && (
        <div className="bg-[#ffffff08] p-3 rounded-md mb-4">
          <div className="text-gray-400 text-xs mb-1 flex items-center">
            <FileTextOutlined className="mr-1" />
            <span>備註</span>
          </div>
          {editable && onDescriptionChange ? (
            <Input.TextArea
              className="bg-[#2a2a2a] border-gray-700 text-white"
              value={item.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={2}
              placeholder="輸入備註信息（可選）"
            />
          ) : (
            <div className="text-white">{item.description || '無備註'}</div>
          )}
        </div>
      )}

      {/* Date */}
      {showDate && item.created_at && (
        <div className="bg-[#ffffff08] p-3 rounded-md mb-4">
          <div className="text-gray-400 text-xs mb-1 flex items-center">
            <CalendarOutlined className="mr-1" />
            <span>日期</span>
          </div>
          <div className="text-white">
            {dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      )}

      {/* Additional Content */}
      {additionalContent}

      {/* Total */}
      {showTotal && (
        <div className="mb-4">
          <div className="text-gray-400 text-xs mb-1">合計</div>
          <div className="text-xl font-bold text-yellow-400">
            {isInfinite ? '依購買數量計算' : `NT $${formatNumber(totalPrice)}`}
          </div>
        </div>
      )}

      {/* Footer Content */}
      {footerContent}

      {/* Action Button */}
      {actionButton}
    </Card>
  );
};

export default PointOrderCard;
