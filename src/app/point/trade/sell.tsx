import Api from '@/api';
import useMessageStore from '@/store/message';
import usePointStore from '@/store/point';
import { Form, InputNumber, Modal, Select } from 'antd';

interface SellModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    id: number;
    price: number;
  };
}

const SellModal = (props: SellModalProps) => {
  const [form] = Form.useForm();
  const setData = useMessageStore((state) => state.setData);

  const set_point_order = usePointStore((state) => state.set_point_order);

  const options = [
    {
      label: '銀行支付',
      value: 'Bank',
    },
  ];

  const onFinish = (values: {
    quantity: number;
    amount: number;
    payMenthod: string;
  }) => {
    Api.Market.post_point_order_buy({
      point_order_id: props.data.id,
      quantity: values.quantity,
    }).then(async (res) => {
      console.log(res, 'res');

      setData({
        show: true,
        content: '您的訂單已成功發佈，請耐心等待賣家出售。',
        type: 'success',
      });

      await Api.Market.get_point_order().then((res) => {
        set_point_order(res.data);
      });

      props.setOpen(false);
    });
  };

  return (
    <Modal
      centered
      open={props.open}
      title={
        <div className="flex flex-col">
          <div>價格 {props.data.price}</div>
          <div className="text-sm text-gray-400">平台手續費 - 0%</div>
        </div>
      }
      cancelText="取消"
      okText="確認"
      onCancel={() => {
        props.setOpen(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <div className="mt-4">
        <Form form={form} onFinish={onFinish} layout="horizontal">
          <Form.Item label="出售點數" name="quantity">
            <InputNumber
              onChange={(value) => {
                if (value && props.data.price) {
                  const result: number = value * props.data.price;
                  form.setFieldsValue({
                    amount: Math.floor(result),
                  });
                }
              }}
              style={{
                width: '100%',
              }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="收到金額" name="amount">
            <InputNumber
              onChange={(value) => {
                if (value && props.data.price) {
                  const result: number = value / props.data.price;
                  form.setFieldsValue({
                    quantity: Math.floor(result),
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

export default SellModal;
