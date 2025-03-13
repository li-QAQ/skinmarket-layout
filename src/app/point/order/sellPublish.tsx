import Api from '@/api';
import useInfoStore from '@/store/info';
import useMessageStore from '@/store/message';
import usePointStore from '@/store/point';
import { formatNumber, numberFormatter, numberParser } from '@/ultis/common';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Slider,
  Divider,
  Card,
  Typography,
  Row,
  Col,
} from 'antd';
import { useState, useEffect } from 'react';
import { DollarOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface BuyPublishModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BuyPublishModal = (props: BuyPublishModalProps) => {
  const [form] = Form.useForm();
  const setData = useMessageStore((state) => state.setData);
  const point = useInfoStore((state) => state.point);
  const set_point_order = usePointStore((state) => state.set_point_order);

  // Watch form values for summary
  const [price, setPrice] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(point || 0);
  const [amount, setAmount] = useState<number>(point || 0);

  // Initialize form values when modal opens or point changes
  useEffect(() => {
    if (props.open && point) {
      const initialPrice = 1;
      const initialQuantity = point;
      const initialAmount = initialPrice * initialQuantity;

      // Update state
      setPrice(initialPrice);
      setQuantity(initialQuantity);
      setAmount(initialAmount);

      // Update form
      form.setFieldsValue({
        price: initialPrice,
        quantity: initialQuantity,
        amount: initialAmount,
      });
    }
  }, [point, form, props.open]);

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

  // Handle price change from input
  const handlePriceChange = (value: number | null) => {
    if (!value || value <= 0) return;

    setPrice(value);
    const newAmount = value * quantity;
    setAmount(newAmount);
    form.setFieldsValue({ amount: newAmount });
  };

  // Handle quantity change from input or slider
  const handleQuantityChange = (value: number | null) => {
    if (!value || value <= 0) return;

    // Update state
    setQuantity(value);

    // Calculate and update amount
    const newAmount = price * value;
    setAmount(newAmount);

    // Update form fields
    form.setFieldsValue({
      quantity: value,
      amount: newAmount,
    });
  };

  // Handle amount change from input
  const handleAmountChange = (value: number | null) => {
    if (!value || value <= 0) return;

    setAmount(value);

    if (price > 0) {
      const newQuantity = Math.floor(value / price);
      setQuantity(newQuantity);
      form.setFieldsValue({ quantity: newQuantity });
    }
  };

  // Slider change handler
  const handleSliderChange = (value: number) => {
    if (value <= 0) return;

    // Update quantity state
    setQuantity(value);

    // Calculate new amount
    const newAmount = price * value;
    setAmount(newAmount);

    // Update form fields
    form.setFieldsValue({
      quantity: value,
      amount: newAmount,
    });
  };

  // Generate slider marks
  const getSliderMarks = () => {
    if (!point || point <= 0) return { 0: '0' };

    const marks: Record<number, string> = {
      1: '1',
    };

    // Add middle mark if point is large enough
    if (point >= 4) {
      const middlePoint = Math.floor(point / 2);
      marks[middlePoint] = `${middlePoint}`;
    }

    // Add max mark
    marks[point] = `${point}`;

    return marks;
  };

  return (
    <Modal
      centered
      open={props.open}
      title={
        <div className="flex flex-col">
          <div className="text-lg font-bold">出售點數</div>
          <div className="text-sm text-gray-400">平台手續費 - 0%</div>
        </div>
      }
      cancelText="取消"
      okText="確認發佈"
      styles={{ body: { padding: '16px 0px' } }}
      onCancel={() => {
        props.setOpen(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        initialValues={{
          price: 1,
          quantity: point,
          amount: point,
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center">
                  <DollarOutlined className="mr-1" />
                  <span>定價 (NT/點數)</span>
                </div>
              }
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
                min={0.01}
                step={0.01}
                precision={2}
                addonAfter="NT$"
                onChange={handlePriceChange}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="點數數量"
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
                min={1}
                max={point}
                onChange={handleQuantityChange}
                addonAfter={`/ ${formatNumber(point || 0)} 點`}
                value={quantity}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
              />
            </Form.Item>

            <Form.Item noStyle>
              <Slider
                min={1}
                max={point || 1}
                value={quantity}
                onChange={handleSliderChange}
                tooltip={{
                  formatter: (value) => {
                    if (typeof value === 'number') {
                      return `${formatNumber(value)} 點`;
                    }
                    return '';
                  },
                }}
                marks={getSliderMarks()}
                styles={{
                  track: { backgroundColor: '#c9a86b' },
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center">
                  <DollarOutlined className="mr-1" />
                  <span>總額 (NT)</span>
                </div>
              }
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
                min={0.01}
                precision={2}
                addonAfter="NT$"
                onChange={handleAmountChange}
                value={amount}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center">
                  <InfoCircleOutlined className="mr-1" />
                  <span>備註</span>
                </div>
              }
              name="description"
            >
              <Input.TextArea
                placeholder="添加關於此交易的備註信息（選填）"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        {/* Transaction Summary */}
        <Card
          title="交易摘要"
          size="small"
          className="bg-gray-50 dark:bg-gray-800"
          styles={{
            header: {
              backgroundColor: 'rgba(0,0,0,0.03)',
              padding: '8px 16px',
            },
            body: { padding: '12px 16px' },
          }}
        >
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Text type="secondary">出售點數:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong>{formatNumber(quantity)} 點</Text>
            </Col>

            <Col span={12}>
              <Text type="secondary">單價:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong>{formatNumber(price, 2)} NT$/點</Text>
            </Col>

            <Col span={12}>
              <Text type="secondary">平台手續費:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong>0.00 NT$</Text>
            </Col>

            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
            </Col>

            <Col span={12}>
              <Text strong>預計收入:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong type="success">
                {formatNumber(amount, 2)} NT$
              </Text>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default BuyPublishModal;
