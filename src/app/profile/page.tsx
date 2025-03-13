'use client';

import useInfoStore from '@/store/info';
import { formatNumber } from '@/ultis/common';
//import { Skeleton } from 'antd';

const ProfilePoint = () => {
  const point = useInfoStore((state) => state.point);
  const totalPoint = useInfoStore((state) => state.total_point);
  const pointsInTransaction = useInfoStore(
    (state) => state.points_in_transaction,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">我的點數</h2>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="bg-white/5 rounded-lg p-4 space-y-6">
          <div className="flex items-center py-3 border-b border-gray-700/20">
            <div className="w-1/4 text-gray-400">可用點數</div>
            <div className="w-3/4 font-semibold text-lg">
              {formatNumber(point)}
            </div>
          </div>
          <div className="flex items-center py-3 border-b border-gray-700/20">
            <div className="w-1/4 text-gray-400">交易中點數</div>
            <div className="w-3/4 font-semibold text-lg">
              {formatNumber(pointsInTransaction)}
            </div>
          </div>
          <div className="flex items-center py-3">
            <div className="w-1/4 text-gray-400">我的總點數</div>
            <div className="w-3/4 font-semibold text-lg">
              {formatNumber(totalPoint)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
          <div className="space-y-1 py-2 border-b border-gray-700/20">
            <div className="text-gray-400 text-sm">可用點數</div>
            <div className="font-semibold text-lg">{formatNumber(point)}</div>
          </div>
          <div className="space-y-1 py-2 border-b border-gray-700/20">
            <div className="text-gray-400 text-sm">交易中點數</div>
            <div className="font-semibold text-lg">
              {formatNumber(pointsInTransaction)}
            </div>
          </div>
          <div className="space-y-1 py-2">
            <div className="text-gray-400 text-sm">我的總點數</div>
            <div className="font-semibold text-lg">
              {formatNumber(totalPoint)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePoint;
