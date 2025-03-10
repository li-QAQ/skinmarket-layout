'use client';

import useInfoStore from '@/store/info';
import { ThousandSymbolFormat } from '@/ultis/common';
//import { Skeleton } from 'antd';

const ProfilePoint = () => {
  const point = useInfoStore((state) => state.point);
  const totalPoint = useInfoStore((state) => state.total_point);
  const pointsInTransaction = useInfoStore(
    (state) => state.points_in_transaction,
  );

  // if (!point || !totalPoint || !pointsInTransaction) {
  //   return <Skeleton active />;
  // }

  return (
    <div className="space-y-4">
      <div>我的點數</div>
      <div className="font-normal space-y-6">
        <div className="flex items-center">
          <div className="basis-1/6">可用點數</div>
          <div className="basis-5/6">{ThousandSymbolFormat(point)}</div>
        </div>
        <div className="flex items-center">
          <div className="basis-1/6">交易中點數</div>
          <div className="basis-5/6">
            {ThousandSymbolFormat(pointsInTransaction)}
          </div>
        </div>
        <div className="flex items-center">
          <div className="basis-1/6">我的總點數</div>
          <div className="basis-5/6">{ThousandSymbolFormat(totalPoint)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePoint;
