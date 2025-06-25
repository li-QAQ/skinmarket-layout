import Api from '@/api';
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
  Alert,
  Progress,
} from 'antd';
import { useState, useEffect } from 'react';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';

const { Text } = Typography;

interface BuyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    id: number;
    price: number;
    description?: string;
    quantity?: number;
    member_id?: string;
  };
}

const BuyModal = (props: BuyModalProps) => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const setData = useMessageStore((state) => state.setData);
  const [quantity, setQuantity] = useState<number>(1);
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>(
    props.data?.quantity,
  );

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1;

  // Ensure price is a valid number
  const price = props.data && props.data.price ? Number(props.data.price) : 0;
  const [amount, setAmount] = useState<number>(price);

  const set_point_order = usePointStore((state) => state.set_point_order);

  const paymentOptions = [
    {
      label: '銀行支付',
      value: 'Bank',
      icon: <BankOutlined />,
    },
  ];

  // Initialize form values when modal opens or price changes
  useEffect(() => {
    if (props.open) {
      const initialQuantity = 1;
      // Ensure price is a valid number
      const validPrice =
        props.data && props.data.price ? Number(props.data.price) : 0;
      const initialAmount = validPrice * initialQuantity;

      // Set max quantity if available
      setMaxQuantity(props.data?.quantity);

      setQuantity(initialQuantity);
      setAmount(initialAmount);

      form.setFieldsValue({
        quantity: initialQuantity,
        amount: initialAmount,
        payMethod: 'Bank',
      });
    }
  }, [form, props.open, props.data]);

  const handleQuantityChange = (value: number | null) => {
    if (!value || value <= 0) return;

    // Check if quantity exceeds available amount
    if (maxQuantity && value > maxQuantity) {
      value = maxQuantity;
    }

    setQuantity(value);

    // Ensure price is a valid number
    const validPrice =
      props.data && props.data.price ? Number(props.data.price) : 0;

    const newAmount = value * validPrice;
    setAmount(newAmount);
    form.setFieldsValue({ quantity: value, amount: newAmount });
  };

  const handleAmountChange = (value: number | null) => {
    if (!value || value <= 0) return;

    setAmount(value);

    // Ensure price is a valid number and not zero
    const validPrice =
      props.data && props.data.price && Number(props.data.price) > 0
        ? Number(props.data.price)
        : 1; // Use 1 as fallback to avoid division by zero

    let newQuantity = Math.floor(value / validPrice);

    // Check if quantity exceeds available amount
    if (maxQuantity && newQuantity > maxQuantity) {
      newQuantity = maxQuantity;
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
        content: '請輸入有效的購買數量',
        type: 'error',
      });
      return;
    }

    // Check if quantity exceeds available amount
    if (maxQuantity && values.quantity > maxQuantity) {
      setData({
        show: true,
        content: `購買數量不能超過可用數量 ${maxQuantity}`,
        type: 'error',
      });
      return;
    }

    Api.Market.post_point_order_buy({
      point_order_id: props.data.id,
      quantity: values.quantity,
    })
      .then(async () => {
        setData({
          show: true,
          content: '您的訂單已成功發佈，請耐心等待賣家出售。',
          type: 'success',
        });

        await Api.Market.get_point_order({
          limit: 12,
          page: currentPage,
        }).then((res) => {
          if (res?.data?.data?.length > 0) {
            set_point_order(res.data.data);
          } else {
            set_point_order([]);
          }
        });

        props.setOpen(false);
      })
      .catch((error) => {
        setData({
          show: true,
          content: error.data?.message || '購買失敗，請稍後再試',
          type: 'error',
        });
      });
  };

  // Ensure price is a valid number for display
  const displayPrice =
    props.data && props.data.price ? Number(props.data.price) : 0;

  // Quick quantity buttons
  const renderQuickQuantityButtons = () => {
    if (!maxQuantity) return null;

    const options = [1, 10, 100];
    if (maxQuantity > 1) options.push(maxQuantity);

    // Filter out options that exceed maxQuantity
    const filteredOptions = options.filter((opt) => opt <= maxQuantity);

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
            {option === maxQuantity ? '全部' : formatNumber(option)}
          </Button>
        ))}
      </div>
    );
  };

  // Calculate percentage of quantity selected
  const getQuantityPercentage = () => {
    if (!maxQuantity || maxQuantity === 0) return 0;
    return Math.min(100, Math.round((quantity / maxQuantity) * 100));
  };

  return (
    <Modal
      centered
      open={props.open}
      closeIcon={false}
      title={
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">購買點數</div>
          {props.data.member_id && (
            <div className="flex items-center">
              <UserOutlined style={{ color: '#c9a86b' }} className="mr-1" />
              <Text>賣家: {props.data.member_id}</Text>
            </div>
          )}
        </div>
      }
      cancelText="取消"
      okText="確認購買"
      styles={{
        body: { padding: '20px 24px' },
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
          quantity: 1,
          amount: displayPrice,
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
                    <span>購買點數</span>
                  </div>
                  {maxQuantity && (
                    <Text type="secondary" className="text-sm">
                      可用: {formatNumber(maxQuantity)} 點
                    </Text>
                  )}
                </div>
              }
              name="quantity"
              rules={[
                {
                  required: true,
                  message: '請輸入購買點數',
                },
                {
                  type: 'number',
                  min: 1,
                  message: '購買點數必須大於0',
                },
                {
                  validator: (_, value) => {
                    if (maxQuantity && value > maxQuantity) {
                      return Promise.reject(
                        `購買數量不能超過 ${formatNumber(maxQuantity)}`,
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              tooltip="您想購買的點數數量"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={maxQuantity}
                onChange={handleQuantityChange}
                value={quantity}
                formatter={numberFormatter}
                parser={(value) => parseFloat(numberParser(value))}
                className="text-lg"
                addonAfter="點"
              />
            </Form.Item>

            {renderQuickQuantityButtons()}

            {maxQuantity && maxQuantity > 1 && (
              <div className="mt-2">
                <Progress
                  percent={getQuantityPercentage()}
                  strokeColor="#c9a86b"
                  size="small"
                  format={() =>
                    `${formatNumber(quantity)}/${formatNumber(maxQuantity)}`
                  }
                />
              </div>
            )}
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <div className="flex items-center">
                  <DollarOutlined className="mr-1" />
                  <span>支付金額</span>
                </div>
              }
              name="amount"
              rules={[
                {
                  required: true,
                  message: '請輸入支付金額',
                },
                {
                  type: 'number',
                  min: 0.01,
                  message: '支付金額必須大於0',
                },
              ]}
              tooltip="購買總金額 = 單價 × 數量"
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
              <Text type="secondary">購買點數:</Text>
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
                總支付金額:
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

        {/* Seller Description */}
        {props.data.description && (
          <div className="mt-4">
            <Alert
              message={
                <div>
                  <div className="font-medium mb-1">賣家備註:</div>
                  <div>{props.data.description}</div>
                </div>
              }
              type="info"
              showIcon
              icon={<InfoCircleOutlined style={{ color: '#c9a86b' }} />}
              style={{
                border: '1px solid rgba(201, 168, 107, 0.3)',
                backgroundColor: 'rgba(201, 168, 107, 0.05)',
              }}
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-center">
          <Space>
            <ArrowRightOutlined style={{ color: '#c9a86b' }} />
            <Text type="secondary">點擊確認購買完成交易</Text>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default BuyModal;
