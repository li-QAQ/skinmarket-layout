'use client';

import { Card, Empty, Skeleton, Pagination } from 'antd';
import { ReactNode } from 'react';
import { PointOrderItem } from './PointOrderCard';

interface PointCardListProps {
  items: PointOrderItem[];
  loading: boolean;
  emptyText?: string;
  title?: string;
  description?: string;
  renderItem: (item: PointOrderItem, index: number) => ReactNode;
  showPagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  className?: string;
}

const PointCardList = ({
  items,
  loading,
  emptyText = '目前沒有可用的訂單',
  title,
  description,
  renderItem,
  showPagination = false,
  pageSize = 9,
  currentPage = 1,
  totalItems,
  onPageChange,
  className = '',
}: PointCardListProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          )}
          {description && <p className="text-gray-400">{description}</p>}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#1a1a1a] border-gray-800">
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && items?.length === 0 && (
        <div className="bg-[#1a1a1a]/50 rounded-lg p-8 text-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span className="text-gray-400">{emptyText}</span>}
          />
        </div>
      )}

      {/* Card Grid View */}
      {!loading && items?.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => renderItem(item, index))}
          </div>

          {/* Pagination */}
          {showPagination && onPageChange && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems || items?.length}
                onChange={onPageChange}
                showSizeChanger={false}
                className="point-pagination"
              />
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        .point-pagination .ant-pagination-item {
          background-color: #2a2a2a;
          border-color: #444;
        }
        .point-pagination .ant-pagination-item a {
          color: #d9d9d9;
        }
        .point-pagination .ant-pagination-item-active {
          background-color: #1890ff;
          border-color: #1890ff;
        }
        .point-pagination .ant-pagination-item-active a {
          color: white;
        }
        .point-pagination .ant-pagination-prev button,
        .point-pagination .ant-pagination-next button {
          background-color: #2a2a2a;
          border-color: #444;
          color: #d9d9d9;
        }
      `}</style>
    </div>
  );
};

export default PointCardList;
