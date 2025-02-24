'use client';

const ProfilePoint = () => {
  return (
    <div className="space-y-4">
      <div>我的點數</div>
      <div className="font-normal space-y-6">
        <div className="flex items-center">
          <div className="basis-1/6">可用點數</div>
          <div className="basis-5/6">1000</div>
        </div>
        <div className="flex items-center">
          <div className="basis-1/6">交易中點數</div>
          <div className="basis-5/6">300</div>
        </div>
        <div className="flex items-center">
          <div className="basis-1/6">我的總點數</div>
          <div className="basis-5/6">1300</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePoint;
