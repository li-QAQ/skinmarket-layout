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
  const [quantity, setQuantity] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  // Initialize form values when modal opens or point changes
  useEffect(() => {
    if (props.open) {
      const initialPrice = 1;
      const initialQuantity = Number(point) || 0;
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
    // Validate point balance before submission
    if (!point || Number(point) <= 0) {
      setData({
        show: true,
        content: '您的點數餘額不足，無法發布訂單',
        type: 'error',
      });
      return;
    }

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
    if (!value || value < 0) return;

    const maxQuantity = Number(point) || 0;
    const adjustedValue = Math.min(value, maxQuantity);

    // Update state
    setQuantity(adjustedValue);

    // Calculate and update amount
    const newAmount = price * adjustedValue;
    setAmount(newAmount);

    // Update form fields
    form.setFieldsValue({
      quantity: adjustedValue,
      amount: newAmount,
    });
  };

  // Handle amount change from input
  const handleAmountChange = (value: number | null) => {
    if (!value || value <= 0) return;

    setAmount(value);

    if (price > 0) {
      const newQuantity = Math.min(
        Math.floor(value / price),
        Number(point) || 0,
      );
      setQuantity(newQuantity);
      form.setFieldsValue({ quantity: newQuantity });
    }
  };

  // Slider change handler
  const handleSliderChange = (value: number) => {
    if (value < 0) return;

    const maxQuantity = Number(point) || 0;
    const adjustedValue = Math.min(value, maxQuantity);

    // Update quantity state
    setQuantity(adjustedValue);

    // Calculate new amount
    const newAmount = price * adjustedValue;
    setAmount(newAmount);

    // Update form fields
    form.setFieldsValue({
      quantity: adjustedValue,
      amount: newAmount,
    });
  };

  // Generate slider marks
  const getSliderMarks = () => {
    const maxPoint = Number(point) || 0;
    if (maxPoint <= 0) return { 0: '0' };

    const marks: Record<number, string> = {
      0: '0',
    };

    // Add middle mark if point is large enough
    if (maxPoint >= 4) {
      const middlePoint = Math.floor(maxPoint / 2);
      marks[middlePoint] = `${middlePoint}`;
    }

    // Add max mark
    marks[maxPoint] = `${maxPoint}`;

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
        if (!point || Number(point) <= 0) {
          setData({
            show: true,
            content: '您的點數餘額不足，無法發布出售訂單',
            type: 'error',
          });
          return;
        }
        form.submit();
      }}
    >
      <Form
        form={form}
        initialValues={{
          price: 1,
          quantity: 0,
          amount: 0,
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
                {
                  type: 'number',
                  min: 0.01,
                  message: '定價必須大於0',
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
                disabled={!point || Number(point) <= 0}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center justify-between w-full">
                  <span>點數數量</span>
                  <Text type="secondary" className="text-sm">
                    您擁有: {formatNumber(Number(point) || 0)} 點
                  </Text>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: '請輸入點數',
                },
                {
                  type: 'number',
                  min: 0,
                  message: '點數不能為負數',
                },
                {
                  validator: (_, value) => {
                    if (!point || Number(point) <= 0) {
                      return Promise.reject('您的點數餘額不足');
                    }
                    if (value > Number(point)) {
                      return Promise.reject(
                        `出售數量不能超過您擁有的點數 ${formatNumber(Number(point))}`,
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              name="quantity"
            >
              <InputNumber
                style={{
                  width: '100%',
                }}
                min={0}
                max={Number(point) || 0}
                onChange={handleQuantityChange}
                addonAfter={`/ ${formatNumber(Number(point) || 0)} 點`}
                value={quantity}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
                disabled={!point || Number(point) <= 0}
              />
            </Form.Item>

            <Form.Item noStyle>
              <Slider
                min={0}
                max={Number(point) || 1}
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
                disabled={!point || Number(point) <= 0}
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
                {
                  type: 'number',
                  min: 0,
                  message: '總額不能為負數',
                },
              ]}
              name="amount"
            >
              <InputNumber
                style={{
                  width: '100%',
                }}
                min={0}
                precision={2}
                addonAfter="NT$"
                onChange={handleAmountChange}
                value={amount}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
                disabled={!point || Number(point) <= 0}
              />
            </Form.Item>
          </Col>

          {(!point || Number(point) <= 0) && (
            <Col span={24}>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 mb-4">
                <Text type="warning">
                  您當前沒有可用的點數餘額，無法發布出售訂單。
                </Text>
              </div>
            </Col>
          )}

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
                disabled={!point || Number(point) <= 0}
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
