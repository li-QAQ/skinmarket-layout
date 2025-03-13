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
  rowKey: string;
  [key: string]: any;
}

function ResponsiveTable<T extends object>({
  dataSource,
  columns,
  breakpoint = 768,
  cardRender,
  mobileOrder,
  rowKey,
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
      <div className="space-y-3" key={String(item[rowKey as keyof T])}>
        {displayColumns
          .filter((col: any) => !col.mobileHidden) // 過濾移動端隱藏列
          .map((col: any) => {
            const value = col.render
              ? col.render(item[col.dataIndex as keyof T], item, 0)
              : item[col.dataIndex as keyof T];

            return (
              <div
                key={col.key}
                className="flex justify-between gap-4 items-center"
              >
                <span className=" font-medium">
                  {col.title as React.ReactNode}
                  {col.key === 'action' ? '' : ':'}
                </span>
                <span
                  className="flex-1"
                  style={{
                    textAlign: col.key === 'action' ? 'right' : 'left',
                  }}
                >
                  {value || '-'}
                </span>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div>
      {/* Desktop Table */}
      <div className={`hidden md:block ${isMobile ? 'hidden' : 'block'}`}>
        <Table
          rowKey={rowKey}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: true }}
          {...props}
        />
      </div>

      {/* Mobile Card List */}
      <div className={`md:hidden ${isMobile ? 'block' : 'hidden'}`}>
        <div className="grid gap-4 grid-cols-1">
          {dataSource?.map((item, index) => (
            <Card key={index}>
              {cardRender ? cardRender(item) : autoCardRender(item)}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResponsiveTable;
