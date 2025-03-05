'use client';
import { useEffect, useRef, useState } from 'react';
import KYCModal from '../kyc';
import { Button, Skeleton, Tag, Tour, TourProps } from 'antd';
import Api from '@/api';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import useTourStore from '@/store/tour';

const ProfileInfo = () => {
  const [isOpenKYC, setIsOpenKYC] = useState(false);
  const [loading, setLoading] = useState(true);

  const [kyc, setKyc] = useState<{
    address: string;
    created_at: string;
    member_id: string;
    phone: string;
    real_name: string;
    status: number;
    updated_at: string;
  }>();

  const kycTour: boolean = useTourStore((state) => state.kycTour);
  const setKycTour = useTourStore((state) => state.setKycTour);
  const ref1 = useRef(null);
  const steps: TourProps['steps'] = [
    {
      title: 'KYC 實名驗證',
      description: '點擊"驗證按鈕"進行實名驗證。',
      target: () => ref1.current,
    },
  ];

  useEffect(() => {
    Api.Member.get_kyc()
      .then((res) => {
        setKyc(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    // 資料還沒回來時，用 Skeleton 占位符，不讓內容閃爍
    return <Skeleton active />;
  }

  return (
    <div className="space-y-4">
      <div>賬戶信息</div>
      <div className="font-normal space-y-6">
        {kyc && (
          <>
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">姓名</div>
              <div className="basis-5/6">{kyc?.address}</div>
            </div>
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">手機號碼</div>
              <div className="basis-5/6">{kyc?.phone}</div>
            </div>
            <div className="flex space-x-20 items-center">
              <div className="basis-1/6">居住地址</div>
              <div className="basis-5/6">{kyc?.address}</div>
            </div>
          </>
        )}

        <Tour open={kycTour} onClose={() => setKycTour(false)} steps={steps} />

        <div className="flex space-x-20 items-center">
          <div className="basis-1/6">KYC 實名</div>
          <div className="basis-5/6">
            <KYCModal open={isOpenKYC} setOpen={setIsOpenKYC} />
            {!kyc && (
              <Button
                ref={ref1}
                type="primary"
                ghost
                onClick={() => setIsOpenKYC(true)}
              >
                驗證
              </Button>
            )}

            {kyc?.status === 0 && (
              <Tag icon={<ClockCircleOutlined />} color="warning">
                審核中
              </Tag>
            )}

            {kyc?.status === 1 && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                已驗證
              </Tag>
            )}

            {kyc?.status === 2 && (
              <Button
                icon={<CloseCircleOutlined />}
                type="primary"
                danger
                ghost
                onClick={() => setIsOpenKYC(true)}
              >
                驗證失敗，重新驗證
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
