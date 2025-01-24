import { numberCarry } from '@/ultis';
import { Form, Input, InputNumber, Modal, Select } from 'antd';

interface BuyPublishModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BuyPublishModal = (props: BuyPublishModalProps) => {
  const [form] = Form.useForm();
  const options = [
    {
      label: '銀行支付',
      value: 'Bank',
    },
  ];
  const rate = Form.useWatch('price', form) + 0.01;

  return (
    <Modal
      centered
      open={props.open}
      title={
        <div className="flex flex-col">
          <div>購買點數</div>
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
        <Form form={form} layout="vertical">
          <Form.Item label="定價(NT/點數)" name="price">
            <InputNumber
              style={{
                width: '100%',
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="總額(NT)" name="amount">
            <InputNumber
              onChange={(value) => {
                if (value) {
                  form.setFieldsValue({
                    income: numberCarry(value / rate, 2),
                  });
                } else {
                  form.setFieldsValue({
                    income: '',
                  });
                }
              }}
              style={{
                width: '100%',
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="點數" name="income">
            <InputNumber
              onChange={(value) => {
                if (value) {
                  form.setFieldsValue({
                    amount: numberCarry(value * rate, 2),
                  });
                } else {
                  form.setFieldsValue({
                    amount: '',
                  });
                }
              }}
              style={{
                width: '100%',
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="訂單限額" name="pay">
            <div className="flex space-x-4">
              <Form.Item noStyle name={['pay', 'min']}>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  min={0}
                />
              </Form.Item>

              <span>~</span>

              <Form.Item noStyle name={['pay', 'max']}>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  min={0}
                />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="支付方式" name="payMenthod">
            <Select allowClear mode="multiple">
              {options.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="備註" name="note">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default BuyPublishModal;
