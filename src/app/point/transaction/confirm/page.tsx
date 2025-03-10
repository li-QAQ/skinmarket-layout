'use client';
import Api from '@/api';
import ResponsiveTable from '@/components/ResponsiveTable';
import { ThousandSymbolFormat } from '@/ultis/common';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const PointTransactionConfirmPage = () => {
  const columns: any = [
    {
      title: '訂單編號',
      dataIndex: 'id',
    },
    {
      title: '單價',
      dataIndex: 'price',
      render: (_: any, record: any) =>
        `${(record.total_price / record.quantity).toFixed(2)} NT`,
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
      render: (total_price: number) => ` ${ThousandSymbolFormat(total_price)}`,
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
      dataIndex: 'action',
      width: 200,
      render: (_: number, record: any) => {
        return (
          <div className="flex space-x-4 ">
            <Button
              type="primary"
              onClick={() => {
                Api.Member.patch_point_confirm(record.id, 1).then(() => {
                  Api.Member.get_point_confirm_seller().then((res) => {
                    setData(res.data);
                  });
                });
              }}
            >
              同意請求
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                Api.Member.patch_point_confirm(record.id, 2).then(() => {
                  Api.Member.get_point_confirm_seller().then((res) => {
                    setData(res.data);
                  });
                });
              }}
            >
              拒絕請求
            </Button>
          </div>
        );
      },
    },
  ];

  const [data, setData] = useState();

  useEffect(() => {
    Api.Member.get_point_confirm_seller().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <>
      <ResponsiveTable
        pagination={{
          pageSize: 8,
        }}
        rowKey="id"
        dataSource={data as any}
        columns={columns}
      />
    </>
  );
};

export default PointTransactionConfirmPage;
