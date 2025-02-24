import Api from '@/api';
import useMessageStore from '@/store/message';
import usePointStore from '@/store/point';
import { Checkbox, Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';

interface BuyPublishModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BuyPublishModal = (props: BuyPublishModalProps) => {
  const [form] = Form.useForm();
  const [infinityBuy, setInfinityBuy] = useState(false);

  const set_acquisition_order = usePointStore(
    (state) => state.set_acquisition_order,
  );
  const setData = useMessageStore((state) => state.setData);

  const onFinish = (values: {
    price: number;
    amount: number;
    quantity: number;
    description: string;
  }) => {
    Api.Market.post_point_acquisition({
      price: values.price,
      quantity: infinityBuy ? -1 : values.quantity,
      description: values.description,
    }).then(async () => {
      await Api.Member.get_point_acquisition().then((res) => {
        set_acquisition_order(res.data);
      });

      setData({
        show: true,
        content: '您的訂單已成功發佈，請耐心等待賣家。',
        type: 'success',
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
          <div>購買點數</div>
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
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            price: 1,
          }}
          layout="vertical"
        >
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
          <Form.Item label="無限收購點數" name="price" noStyle>
            <Checkbox
              onChange={() => {
                setInfinityBuy(!infinityBuy);
              }}
            >
              無限收購點數
            </Checkbox>
          </Form.Item>
          <Form.Item
            label="點數"
            rules={[
              {
                required: !infinityBuy,
                message: '請輸入點數',
              },
            ]}
            name="quantity"
          >
            <InputNumber
              disabled={infinityBuy}
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
                required: !infinityBuy,
                message: '請輸入總額',
              },
            ]}
            name="amount"
          >
            <InputNumber
              disabled={infinityBuy}
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
