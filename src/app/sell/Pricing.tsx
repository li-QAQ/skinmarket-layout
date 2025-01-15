import useSell from '@/store/sell';
import { Button, Form, InputNumber, Modal } from 'antd';
import Image from 'next/image';

const PricingModal = () => {
  const [form] = Form.useForm();
  const { isOpenPricingModal, setIsOpenPricingModal, getSelectedItems } =
    useSell();
  const handleOk = () => {
    setIsOpenPricingModal(false);
  };

  const handleCancel = () => {
    setIsOpenPricingModal(false);
  };

  const handleFinish = (values: any) => {
    console.log(values);
  };

  const footer = () => {
    return (
      <div>
        <hr className="border-2" />
        <div className="flex justify-between items-center">
          <div className="font-bold flex flex-col space-y-2">
            <div className="text-2xl">預計收入:</div>
            <div className="text-md text-left">手續費:</div>
          </div>
          <Button type="primary" size="large" onClick={() => form.submit()}>
            改價
          </Button>
        </div>
      </div>
    );
  };

  const data = getSelectedItems();

  return (
    <Modal
      centered
      title={null}
      footer={footer()}
      open={isOpenPricingModal}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1200}
    >
      <Form form={form} onFinish={handleFinish}>
        <div className="flex text-xl font-bold mb-4">
          <div className="basis-1/6">圖片</div>
          <div className="basis-1/6">名稱</div>
          <div className="basis-1/6">參考價</div>
          <div className="basis-1/6">物品數量</div>
          <div className="basis-1/6">買家支付金額</div>
          <div className="basis-1/6">實收金額</div>
        </div>

        <div className="flex flex-col space-y-4">
          {data.length > 0 &&
            data.map((item, index: number) => (
              <div key={index} className="flex gap-10">
                <div className="basis-1/6 flex">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 relative border-2 rounded-2xl">
                      <Image
                        src={item.image}
                        fill
                        style={{ objectFit: 'contain', userSelect: 'none' }}
                        alt={item.name}
                      />
                    </div>
                  </div>
                </div>
                <div className="basis-1/6 flex items-center">{item.name}</div>
                <div className="basis-1/6 flex items-center">${item.price}</div>
                <div className="basis-1/6 flex items-center">
                  <Form.Item name={[index, 'count']} noStyle>
                    <InputNumber
                      placeholder="請輸入數量"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
                <div className="basis-1/6 flex items-center">
                  <Form.Item name={[index, 'price1']} noStyle>
                    <InputNumber
                      placeholder="請輸入金額"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
                <div className="basis-1/6 flex items-center">
                  <Form.Item name={[index, 'price2']} noStyle>
                    <InputNumber
                      placeholder="請輸入金額"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
              </div>
            ))}
        </div>
      </Form>
    </Modal>
  );
};

export default PricingModal;
