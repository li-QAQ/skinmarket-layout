import { Form, InputNumber, Modal } from 'antd';
import { useState } from 'react';

interface BuyConfirmModalProps {
  orderId: string;
  open: boolean;
  onRefrash?: () => void;
  setOpen: (open: boolean) => void;
}
const BuyConfirmModal = (props: BuyConfirmModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    props.setOpen(false);
  };

  const handleFinish = (values: any) => {};

  return (
    <Modal
      title={null}
      confirmLoading={loading}
      centered
      open={props.open}
      onOk={handleOk}
      okText="確認"
      cancelText="取消"
      onCancel={handleCancel}
      closable={false}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item label="數量" name="quantity">
          <InputNumber className="w-full" min="1" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BuyConfirmModal;
