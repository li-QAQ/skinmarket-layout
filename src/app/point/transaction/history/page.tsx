'use client';
import Api from '@/api';
import ResponsiveTable from '@/components/ResponsiveTable';
import { ThousandSymbolFormat } from '@/ultis/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const PointTransactionHistoryPage = () => {
  const columns: any = [
    {
      title: '訂單編號',
      dataIndex: 'id',
      render: (id: number, record: any) =>
        record.reference_type === 'PointOrder' ? `O_${id}` : `A_${id}`,
    },
    {
      title: '請求編號',
      dataIndex: 'reference_id',
    },
    // {
    //   title: '交易類型',
    //   dataIndex: 'reference_type',
    // },
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
      reference_type: string;
      reference_id: number;
      seller_id: string;
      buyer_id: string;
      quantity: number;
      total_price: number;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    Api.Member.get_point_transaction_history().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <ResponsiveTable
      rowKey="id"
      pagination={{
        pageSize: 8,
      }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default PointTransactionHistoryPage;
