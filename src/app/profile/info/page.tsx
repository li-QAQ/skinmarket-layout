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
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">賬戶信息</h2>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="bg-white/5 rounded-lg p-4 space-y-6">
          {kyc && (
            <>
              <div className="flex items-center py-3 border-b border-gray-700/20">
                <div className="w-1/4 text-gray-400">姓名</div>
                <div className="w-3/4 font-semibold text-lg">
                  {kyc?.real_name}
                </div>
              </div>
              <div className="flex items-center py-3 border-b border-gray-700/20">
                <div className="w-1/4 text-gray-400">手機號碼</div>
                <div className="w-3/4 font-semibold text-lg">{kyc?.phone}</div>
              </div>
              <div className="flex items-center py-3 border-b border-gray-700/20">
                <div className="w-1/4 text-gray-400">居住地址</div>
                <div className="w-3/4 font-semibold text-lg">
                  {kyc?.address}
                </div>
              </div>
            </>
          )}

          <Tour
            open={kycTour}
            onClose={() => setKycTour(false)}
            steps={steps}
          />

          <div className="flex items-center py-3">
            <div className="w-1/4 text-gray-400">KYC 實名</div>
            <div className="w-3/4">
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

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
          {kyc && (
            <>
              <div className="space-y-1 py-2 border-b border-gray-700/20">
                <div className="text-gray-400 text-sm">姓名</div>
                <div className="font-semibold text-lg">{kyc?.real_name}</div>
              </div>
              <div className="space-y-1 py-2 border-b border-gray-700/20">
                <div className="text-gray-400 text-sm">手機號碼</div>
                <div className="font-semibold text-lg">{kyc?.phone}</div>
              </div>
              <div className="space-y-1 py-2 border-b border-gray-700/20">
                <div className="text-gray-400 text-sm">居住地址</div>
                <div className="font-semibold text-lg">{kyc?.address}</div>
              </div>
            </>
          )}

          <div className="space-y-1 py-2">
            <div className="text-gray-400 text-sm">KYC 實名</div>
            <div className="mt-2">
              <KYCModal open={isOpenKYC} setOpen={setIsOpenKYC} />
              {!kyc && (
                <Button
                  ref={ref1}
                  type="primary"
                  ghost
                  onClick={() => setIsOpenKYC(true)}
                  className="w-full"
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
                  className="w-full"
                >
                  驗證失敗，重新驗證
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
