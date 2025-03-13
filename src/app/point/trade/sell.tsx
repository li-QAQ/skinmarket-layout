import Api from '@/api';
import useInfoStore from '@/store/info';
import useMessageStore from '@/store/message';
import usePointStore from '@/store/point';
import { formatNumber, numberFormatter, numberParser } from '@/ultis/common';
import {
  Form,
  InputNumber,
  Modal,
  Select,
  Divider,
  Card,
  Typography,
  Row,
  Col,
  Tooltip,
  Space,
  Button,
  Statistic,
  Progress,
} from 'antd';
import { useState, useEffect } from 'react';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  QuestionCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface SellModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    id: number;
    price: number;
    member_id?: string;
    quantity?: number;
    description?: string;
  };
}

const SellModal = (props: SellModalProps) => {
  const [form] = Form.useForm();
  const setData = useMessageStore((state) => state.setData);
  const set_acquisition_order = usePointStore(
    (state) => state.set_acquisition_order,
  );
  const point = useInfoStore((state) => state.point);
  const [quantity, setQuantity] = useState<number>(Number(point) || 0);
  const [amount, setAmount] = useState<number>(
    (Number(point) || 0) * (Number(props.data?.price) || 0),
  );

  const paymentOptions = [
    {
      label: '銀行支付',
      value: 'Bank',
      icon: <BankOutlined />,
    },
  ];

  // Initialize form values when modal opens or price/point changes
  useEffect(() => {
    if (props.open) {
      const initialQuantity = Math.min(
        Number(point) || 0,
        Number(props.data?.quantity) || Infinity,
      );
      const initialAmount = initialQuantity * (Number(props.data?.price) || 0);

      setQuantity(initialQuantity);
      setAmount(initialAmount);

      form.setFieldsValue({
        quantity: initialQuantity,
        amount: initialAmount,
        payMethod: 'Bank',
      });
    }
  }, [form, props.open, props.data, point]);

  const handleQuantityChange = (value: number | null) => {
    if (!value || value <= 0) return;

    // Check if quantity exceeds user's available points
    if (point && value > Number(point)) {
      value = Number(point);
    }

    // Check if quantity exceeds buyer's requested quantity
    if (props.data.quantity && value > Number(props.data.quantity)) {
      value = Number(props.data.quantity);
    }

    setQuantity(value);

    // Calculate new amount
    const validPrice = Number(props.data?.price) || 0;
    const newAmount = value * validPrice;
    setAmount(newAmount);
    form.setFieldsValue({ quantity: value, amount: newAmount });
  };

  const handleAmountChange = (value: number | null) => {
    if (!value || value <= 0) return;

    setAmount(value);

    // Calculate new quantity
    const validPrice =
      props.data?.price && Number(props.data.price) > 0
        ? Number(props.data.price)
        : 1; // Use 1 as fallback to avoid division by zero

    let newQuantity = Math.floor(value / validPrice);

    // Check if quantity exceeds user's available points
    if (point && newQuantity > Number(point)) {
      newQuantity = Number(point);
      const adjustedAmount = newQuantity * validPrice;
      setAmount(adjustedAmount);
      form.setFieldsValue({ amount: adjustedAmount });
    }

    // Check if quantity exceeds buyer's requested quantity
    if (props.data.quantity && newQuantity > Number(props.data.quantity)) {
      newQuantity = Number(props.data.quantity);
      const adjustedAmount = newQuantity * validPrice;
      setAmount(adjustedAmount);
      form.setFieldsValue({ amount: adjustedAmount });
    }

    setQuantity(newQuantity);
    form.setFieldsValue({ quantity: newQuantity });
  };

  const onFinish = (values: {
    quantity: number;
    amount: number;
    payMethod: string;
  }) => {
    // Validate quantity before submission
    if (!values.quantity || values.quantity <= 0) {
      setData({
        show: true,
        content: '請輸入有效的出售數量',
        type: 'error',
      });
      return;
    }

    // Check if quantity exceeds user's available points
    if (point && values.quantity > Number(point)) {
      setData({
        show: true,
        content: `出售數量不能超過您擁有的點數 ${formatNumber(Number(point))}`,
        type: 'error',
      });
      return;
    }

    // Check if quantity exceeds buyer's requested quantity
    if (props.data.quantity && values.quantity > Number(props.data.quantity)) {
      setData({
        show: true,
        content: `出售數量不能超過買家需求量 ${formatNumber(Number(props.data.quantity))}`,
        type: 'error',
      });
      return;
    }

    Api.Market.post_point_acquisition_sell({
      point_acquisition_id: props.data.id,
      quantity: values.quantity,
    })
      .then(async (res) => {
        console.log(res, 'res');

        setData({
          show: true,
          content: '您的訂單已成功發佈，請耐心等待買家購買。',
          type: 'success',
        });

        await Api.Market.get_point_acquisition().then((res) => {
          set_acquisition_order(res.data);
        });

        props.setOpen(false);
      })
      .catch((err) => {
        setData({
          show: true,
          content: err.data.message || '出售失敗，請稍後再試',
          type: 'error',
        });
      });
  };

  // Ensure price is a valid number for display
  const displayPrice = Number(props.data?.price) || 0;

  // Quick quantity buttons
  const renderQuickQuantityButtons = () => {
    if (!point || Number(point) <= 0) return null;

    const maxSellable = Math.min(
      Number(point) || 0,
      Number(props.data?.quantity) || Infinity,
    );
    const options = [1, 10, 100];

    // Add half and full options if they make sense
    if (maxSellable > 2) options.push(Math.floor(maxSellable / 2));
    if (maxSellable > 1) options.push(maxSellable);

    // Filter out options that exceed maxSellable
    const filteredOptions = options.filter((opt) => opt <= maxSellable);

    // Remove duplicates and sort
    const uniqueOptions = Array.from(new Set(filteredOptions)).sort(
      (a, b) => a - b,
    );

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {uniqueOptions.map((option) => (
          <Button
            key={option}
            size="small"
            onClick={() => handleQuantityChange(option)}
            style={{ borderColor: '#c9a86b' }}
          >
            {option === maxSellable ? '最大' : formatNumber(option)}
          </Button>
        ))}
      </div>
    );
  };

  // Calculate percentage of quantity selected relative to buyer's requested quantity
  const getBuyerRequestPercentage = () => {
    if (!props.data.quantity || Number(props.data.quantity) === 0) return 100;
    return Math.min(
      100,
      Math.round((quantity / Number(props.data.quantity)) * 100),
    );
  };

  // Calculate max sellable quantity
  const maxSellable = Math.min(
    Number(point) || 0,
    Number(props.data?.quantity) || Infinity,
  );

  return (
    <Modal
      centered
      open={props.open}
      closeIcon={false}
      title={
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">出售點數</div>
          {props.data.member_id && (
            <div className="flex items-center">
              <Text>買家: {props.data.member_id}</Text>
            </div>
          )}
        </div>
      }
      cancelText="取消"
      okText="確認出售"
      styles={{
        body: { padding: '20px 0px' },
        mask: { backdropFilter: 'blur(4px)' },
        content: { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
      }}
      onCancel={() => {
        props.setOpen(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          quantity: Math.min(
            Number(point) || 0,
            Number(props.data?.quantity) || Infinity,
          ),
          amount:
            Math.min(
              Number(point) || 0,
              Number(props.data?.quantity) || Infinity,
            ) * (Number(props.data?.price) || 0),
          payMethod: 'Bank',
        }}
      >
        {/* Price Display */}
        <div className="mb-6 text-center">
          <Text type="secondary">單價</Text>
          <div className="mt-1">
            <Statistic
              value={displayPrice}
              precision={2}
              suffix="NT$/點"
              valueStyle={{
                color: '#c9a86b',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            />
          </div>
          <Text type="secondary" className="text-xs">
            平台手續費 - 0%
          </Text>
        </div>

        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <ShoppingCartOutlined className="mr-1" />
                    <span>出售點數</span>
                  </div>
                  <div className="flex items-center">
                    <Text type="secondary" className="text-sm mr-2">
                      您擁有: {formatNumber(Number(point) || 0)} 點
                    </Text>
                    {props.data.quantity && (
                      <Text type="secondary" className="text-sm">
                        買家需求: {formatNumber(Number(props.data.quantity))} 點
                      </Text>
                    )}
                  </div>
                </div>
              }
              name="quantity"
              rules={[
                {
                  required: true,
                  message: '請輸入出售點數',
                },
                {
                  type: 'number',
                  min: 1,
                  message: '出售點數必須大於0',
                },
                {
                  validator: (_, value) => {
                    if (point && value > Number(point)) {
                      return Promise.reject(
                        `出售數量不能超過您擁有的點數 ${formatNumber(Number(point))}`,
                      );
                    }
                    if (
                      props.data.quantity &&
                      value > Number(props.data.quantity)
                    ) {
                      return Promise.reject(
                        `出售數量不能超過買家需求量 ${formatNumber(Number(props.data.quantity))}`,
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              tooltip="您想出售的點數數量"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={maxSellable}
                onChange={handleQuantityChange}
                value={quantity}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
                className="text-lg"
                addonAfter="點"
              />
            </Form.Item>

            {renderQuickQuantityButtons()}

            {point && Number(point) > 1 && (
              <div className="mt-2">
                <Progress
                  percent={getBuyerRequestPercentage()}
                  strokeColor="#c9a86b"
                  size="small"
                  format={() =>
                    props.data.quantity
                      ? `${formatNumber(quantity)}/${formatNumber(Number(props.data.quantity))}`
                      : `${formatNumber(quantity)}`
                  }
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {props.data.quantity
                    ? `您將滿足買家 ${getBuyerRequestPercentage()}% 的需求量`
                    : '買家接受任意數量'}
                </div>
              </div>
            )}
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center">
                  <DollarOutlined className="mr-1" />
                  <span>收到金額</span>
                </div>
              }
              name="amount"
              rules={[
                {
                  required: true,
                  message: '請輸入收到金額',
                },
                {
                  type: 'number',
                  min: 0.01,
                  message: '收到金額必須大於0',
                },
              ]}
              tooltip="收到金額 = 單價 × 數量"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0.01}
                precision={2}
                addonAfter="NT$"
                onChange={handleAmountChange}
                value={amount}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
                className="text-lg"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center">
                  <BankOutlined className="mr-1" />
                  <span>支付方式</span>
                </div>
              }
              name="payMethod"
              tooltip="選擇您的支付方式"
            >
              <Select>
                {paymentOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    <Space>
                      {option.icon}
                      {option.label}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Transaction Summary */}
        <Card
          title={
            <div className="flex items-center">
              <span>交易摘要</span>
              <Tooltip title="此摘要顯示您的訂單信息">
                <QuestionCircleOutlined className="ml-2 text-gray-400" />
              </Tooltip>
            </div>
          }
          size="small"
          className="bg-gray-50 dark:bg-gray-800 mt-4"
          styles={{
            header: {
              backgroundColor: 'rgba(0,0,0,0.03)',
              padding: '8px 16px',
            },
            body: { padding: '12px 16px' },
          }}
        >
          <Row gutter={[8, 8]} align="middle">
            <Col span={12}>
              <Text type="secondary">出售點數:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong style={{ fontSize: '16px' }}>
                {formatNumber(quantity)} 點
              </Text>
            </Col>

            <Col span={12}>
              <Text type="secondary">單價:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong>{formatNumber(displayPrice, 2)} NT$/點</Text>
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
              <Text strong style={{ fontSize: '16px' }}>
                總收到金額:
              </Text>
            </Col>
            <Col span={12} className="text-right">
              <Statistic
                value={amount}
                precision={2}
                suffix="NT$"
                valueStyle={{
                  color: '#c9a86b',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              />
            </Col>
          </Row>
        </Card>

        <div className="mt-4 flex items-center justify-center">
          <Space>
            <ArrowRightOutlined style={{ color: '#c9a86b' }} />
            <Text type="secondary">點擊確認出售完成交易</Text>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default SellModal;
