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

  // 创建两个引用，分别用于桌面版和移动版的验证按钮
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  // 根据屏幕宽度动态选择正确的引用
  const getTargetRef = () => {
    // 如果在客户端且窗口宽度小于 768px，使用移动版引用
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return mobileRef;
    }
    // 否则使用桌面版引用
    return desktopRef;
  };

  const steps: TourProps['steps'] = [
    {
      title: 'KYC 實名驗證',
      description: '點擊"驗證按鈕"進行實名驗證。',
      target: () => getTargetRef().current,
    },
  ];

  // 刷新用户令牌
  const refreshUserToken = async () => {
    try {
      // 从 localStorage 获取 refresh_token
      const refreshToken = localStorage.getItem('token');

      if (!refreshToken) {
        console.error('No refresh token found');
        return false;
      }

      // 调用 refresh_token API
      const response = await Api.Auth.auth_update({
        refresh_token: refreshToken,
      });

      // 获取新的 access_token 并更新到 localStorage
      if (response && response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  };

  useEffect(() => {
    // 获取 KYC 信息
    Api.Member.get_kyc()
      .then((res) => {
        setKyc(res.data);

        // 如果 KYC 状态为 1（已验证），刷新令牌
        if (res.data && res.data.status === 1) {
          console.log('KYC status is 1, refreshing token...');
          refreshUserToken();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 只有当 KYC 未完成且页面加载完成时才显示引导
  const shouldShowTour = kycTour && !loading && !kyc;

  if (loading) {
    // 資料還沒回來時，用 Skeleton 占位符，不讓內容閃爍
    return <Skeleton active />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">賬戶信息</h2>

      {/* Tour 组件放在外层，确保在任何视图下都能正确显示 */}
      <Tour
        open={shouldShowTour}
        onClose={() => setKycTour(false)}
        steps={steps}
      />

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

          <div className="flex items-center py-3">
            <div className="w-1/4 text-gray-400">KYC 實名</div>
            <div className="w-3/4">
              <KYCModal open={isOpenKYC} setOpen={setIsOpenKYC} />
              {!kyc && (
                <Button
                  ref={desktopRef}
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
                  ref={mobileRef}
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
