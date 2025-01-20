import { Button } from 'antd';

const Certification = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-xl font-bold">請先完成KYC驗證，以便後續交易</div>
      <Button type="primary" size="large" className="font-bold" ghost>
        前往驗證
      </Button>
    </div>
  );
};
export default Certification;
