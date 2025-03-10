'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Api from '@/api';
import { parseJwt } from '@/ultis/common';
import useInfoStore from '@/store/info';

export default function AuthHandler() {
  const searchParams = useSearchParams();
  const login_token = searchParams.get('token') as string;
  const token = useInfoStore((state) => state.token);
  const setToken = useInfoStore((state) => state.setToken);
  const setMemberId = useInfoStore((state) => state.setMemberId);
  const setMerchantId = useInfoStore((state) => state.setMerchantId);
  const setPoint = useInfoStore((state) => state.setPoint);
  const setPointsInTransaction = useInfoStore(
    (state) => state.setPointsInTransaction,
  );
  const setTotalPoint = useInfoStore((state) => state.setTotalPoint);
  const setKycStatus = useInfoStore((state) => state.setKycStatus);
  const [refreshToken, setRefreshToken] = useState(false);

  useEffect(() => {
    if (login_token) {
      const jwt = parseJwt(login_token);

      const memberId = jwt.jti;
      const kycStatus = jwt.kyc_status;
      const merchantId = jwt.iss.split('merchant: ')[1];

      setMemberId(memberId);
      setMerchantId(merchantId);

      localStorage.setItem('member_id', memberId);
      localStorage.setItem('merchant_id', merchantId);

      const fetchToken = async () => {
        await Api.Auth.auth_login({
          id: memberId,
          login_token,
        }).then(async (res) => {
          const token = res.data.access_token;

          await setKycStatus(kycStatus);
          await setToken(token);
          await setRefreshToken(true);
          localStorage.setItem('token', token);
        });
      };

      fetchToken();
    }
  }, [login_token]);

  useEffect(() => {
    if (token) {
      if (login_token) {
        if (refreshToken) {
          Api.Member.get_info().then((res) => {
            console.log(res, 'res');
            setPoint(res.data.point);
            setMemberId(res.data.member_id);
            setPointsInTransaction(res.data.points_in_transaction);
            setTotalPoint(res.data.total_point);
          });
        }
      } else {
        Api.Member.get_info().then((res) => {
          setPoint(res.data.point);
          setMemberId(res.data.member_id);
          setPointsInTransaction(res.data.points_in_transaction);
          setTotalPoint(res.data.total_point);
        });
      }
    }
  }, [token, login_token, refreshToken]);

  return null; // 這個組件不需要渲染任何內容
}
