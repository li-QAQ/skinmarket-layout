import Api from '@/api';
import useMessageStore from '@/store/message';
import usePointStore from '@/store/point';
import { Form, Input, InputNumber, Modal } from 'antd';

interface BuyPublishModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BuyPublishModal = (props: BuyPublishModalProps) => {
  const [form] = Form.useForm();
  const setData = useMessageStore((state) => state.setData);

  const set_point_order = usePointStore((state) => state.set_point_order);

  const onFinish = async (values: {
    price: number;
    amount: number;
    quantity: number;
    description: string;
  }) => {
    try {
      await Api.Market.post_point_order({
        price: values.price,
        quantity: values.quantity,
        description: values.description,
      });

      await Api.Member.get_point_order().then((res) => {
        set_point_order(res.data);
      });

      setData({
        show: true,
        content: '您的訂單已成功發佈，請耐心等待買家。',
        type: 'success',
      });

      props.setOpen(false);
    } catch (error: any) {
      setData({
        show: true,
        content: error.data.message,
        type: 'error',
      });
    }
  };

  return (
    <Modal
      centered
      open={props.open}
      title={
        <div className="flex flex-col">
          <div>出售點數</div>
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
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="定價(NT/點數)"
            rules={[
              {
                required: true,
                message: '請輸入定價',
              },
            ]}
            name="price"
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              min={0}
              onChange={(value) => {
                if (value) {
                  const result: number = form.getFieldValue('amount') / value;
                  if (result) {
                    form.setFieldsValue({
                      quantity: Math.floor(result),
                    });
                  }
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="點數"
            rules={[
              {
                required: true,
                message: '請輸入點數',
              },
            ]}
            name="quantity"
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              min={0}
              onChange={(value) => {
                const price = form.getFieldValue('price');
                if (value && price) {
                  const result: number = value * price;
                  form.setFieldsValue({
                    amount: Math.floor(result),
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="總額(NT)"
            rules={[
              {
                required: true,
                message: '請輸入總額',
              },
            ]}
            name="amount"
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              min={0}
              onChange={(value) => {
                const price = form.getFieldValue('price');
                if (value && price) {
                  const result: number = value / price;
                  form.setFieldsValue({
                    quantity: Math.floor(result),
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item label="備註" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default BuyPublishModal;
