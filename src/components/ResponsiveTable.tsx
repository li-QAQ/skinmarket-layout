'use client';
import useWindowSize from '@/hook/useWindowSize';
import { Table, Card } from 'antd';
import type { TableColumnsType } from 'antd';

interface ResponsiveTableProps<T> {
  dataSource: T[];
  columns: TableColumnsType<T>;
  breakpoint?: number;
  cardRender?: (item: T) => React.ReactNode; // 可選覆蓋
  mobileOrder?: (keyof T)[]; // 移動端專用排序
  [key: string]: any;
}

function ResponsiveTable<T extends object>({
  dataSource,
  columns,
  breakpoint = 768,
  cardRender,
  mobileOrder,
  ...props
}: ResponsiveTableProps<T>) {
  const { width } = useWindowSize();
  const isMobile = width < breakpoint;

  // 自動生成卡片內容
  const autoCardRender = (item: T) => {
    const displayColumns = mobileOrder
      ? columns.sort(
          (a: any, b: any) =>
            mobileOrder.indexOf(a.key!) - mobileOrder.indexOf(b.key!),
        )
      : columns;

    return (
      <div className="space-y-3">
        {displayColumns
          .filter((col: any) => !col.mobileHidden) // 過濾移動端隱藏列
          .map((col: any) => {
            const value = col.render
              ? col.render(item[col.dataIndex as keyof T], item, 0)
              : item[col.dataIndex as keyof T];

            return (
              <div key={col.key} className="flex justify-between gap-4">
                <span className="text-gray-600 font-medium">
                  {col.title as React.ReactNode}:
                </span>
                <span className="text-gray-800 flex-1 text-right">
                  {value || '-'}
                </span>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Desktop Table */}
      <div className={`hidden md:block ${isMobile ? 'hidden' : 'block'}`}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: true }}
          bordered
          {...props}
        />
      </div>

      {/* Mobile Card List */}
      <div className={`md:hidden ${isMobile ? 'block' : 'hidden'}`}>
        <div className="grid gap-4 grid-cols-1">
          {dataSource.map((item, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              {cardRender ? cardRender(item) : autoCardRender(item)}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResponsiveTable;
