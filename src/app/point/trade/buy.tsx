import { numberCarry } from '@/ultis/common';
import { Form, InputNumber, Modal, Select } from 'antd';

interface BuyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    price: number;
  };
}

const BuyModal = (props: BuyModalProps) => {
  const [form] = Form.useForm();
  const rate = props.data.price + 0.01;
  const options = [
    {
      label: '銀行支付',
      value: 'Bank',
    },
    {
      label: 'Line Pay',
      value: 'LinePay',
    },
    {
      label: '街口支付',
      value: 'JKOPay',
    },
  ];

  return (
    <Modal
      centered
      open={props.open}
      title={
        <div className="flex flex-col">
          <div>價格 1.09 NT</div>
          <div className="text-sm text-gray-400">平台手續費 - 1%</div>
        </div>
      }
      cancelText="取消"
      okText="確認"
      onCancel={() => {
        props.setOpen(false);
      }}
      onOk={() => {
        props.setOpen(false);
      }}
    >
      <div className="mt-4">
        <Form form={form} layout="horizontal">
          <Form.Item label="支付金額" name="pay">
            <InputNumber
              onChange={(value) => {
                if (value) {
                  form.setFieldsValue({
                    receive: numberCarry(value / rate, 2),
                  });
                } else {
                  form.setFieldsValue({
                    receive: '',
                  });
                }
              }}
              style={{
                width: '100%',
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="收到點數" name="receive">
            <InputNumber
              onChange={(value) => {
                if (value) {
                  form.setFieldsValue({
                    pay: numberCarry(value * rate, 2),
                  });
                } else {
                  form.setFieldsValue({
                    pay: '',
                  });
                }
              }}
              style={{
                width: '100%',
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="支付方式" name="payMenthod">
            <Select allowClear>
              {options.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default BuyModal;
