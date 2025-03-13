'use client';
import Api from '@/api';
import useInfoStore from '@/store/info';
import { formatNumber } from '@/ultis/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ResponsiveTable from '@/components/ResponsiveTable';

const BuyerFailedPage = () => {
  const member_id = useInfoStore((state) => state.member_id);

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
      render: (quantity: number) => formatNumber(quantity),
      align: 'right',
    },
    {
      title: '總額',
      dataIndex: 'total_price',
      render: (total_price: number) => `NT ${formatNumber(total_price)}`,
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
    Api.Member.get_point_confirm_failed_buyer().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <ResponsiveTable
      pagination={{
        pageSize: 8,
      }}
      rowKey="id"
      dataSource={data as any}
      columns={failedColumns}
    />
  );
};

export default BuyerFailedPage;
