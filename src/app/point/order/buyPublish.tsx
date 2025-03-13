import Api from '@/api';
import useMessageStore from '@/store/message';
import usePointStore from '@/store/point';
import { formatNumber, numberFormatter, numberParser } from '@/ultis/common';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Divider,
  Card,
  Typography,
  Row,
  Col,
  Radio,
  Space,
  Tooltip,
} from 'antd';
import { useState, useEffect } from 'react';
import {
  DollarOutlined,
  InfoCircleOutlined,
  SwapOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface BuyPublishModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Predefined quantity options
const QUANTITY_OPTIONS = [100, 500, 1000, 5000, 10000];

const BuyPublishModal = (props: BuyPublishModalProps) => {
  const [form] = Form.useForm();
  const [buyMode, setBuyMode] = useState<'fixed' | 'infinity'>('fixed');
  const [isMobile, setIsMobile] = useState(false);

  // Watch form values for summary
  const [price, setPrice] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(100);
  const [amount, setAmount] = useState<number>(100);
  const [customQuantity, setCustomQuantity] = useState<boolean>(false);

  const set_acquisition_order = usePointStore(
    (state) => state.set_acquisition_order,
  );
  const setData = useMessageStore((state) => state.setData);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Initialize form values when modal opens
  useEffect(() => {
    if (props.open) {
      const initialPrice = 1;
      const initialQuantity = 100;
      const initialAmount = initialPrice * initialQuantity;

      // Update state
      setPrice(initialPrice);
      setQuantity(initialQuantity);
      setAmount(initialAmount);
      setBuyMode('fixed');
      setCustomQuantity(false);

      // Update form
      form.setFieldsValue({
        price: initialPrice,
        quantity: initialQuantity,
        amount: initialAmount,
        buyMode: 'fixed',
        quantityOption: initialQuantity,
      });
    }
  }, [form, props.open]);

  const onFinish = async (values: {
    price: number;
    amount: number;
    quantity: number;
    description: string;
  }) => {
    try {
      await Api.Market.post_point_acquisition({
        price: values.price,
        quantity: buyMode === 'infinity' ? -1 : values.quantity,
        description: values.description,
      });

      await Api.Member.get_point_acquisition().then((res) => {
        set_acquisition_order(res.data);
      });

      setData({
        show: true,
        content: '您的訂單已成功發佈，請耐心等待賣家。',
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

    if (buyMode === 'fixed') {
      const newAmount = value * quantity;
      setAmount(newAmount);
      form.setFieldsValue({ amount: newAmount });
    }
  };

  // Handle quantity change from input or radio
  const handleQuantityChange = (value: number | null) => {
    if (!value || value <= 0 || buyMode === 'infinity') return;

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

  // Handle quantity option selection
  const handleQuantityOptionChange = (value: number) => {
    if (value === 0) {
      // Custom quantity selected
      setCustomQuantity(true);
    } else {
      // Predefined quantity selected
      setCustomQuantity(false);
      handleQuantityChange(value);

      // Directly update the quantity field in the form
      form.setFieldsValue({
        quantity: value,
        amount: price * value,
      });
    }
  };

  // Handle amount change from input
  const handleAmountChange = (value: number | null) => {
    if (!value || value <= 0 || buyMode === 'infinity') return;

    setAmount(value);

    if (price > 0) {
      const newQuantity = Math.floor(value / price);
      setQuantity(newQuantity);
      form.setFieldsValue({
        quantity: newQuantity,
        quantityOption: QUANTITY_OPTIONS.includes(newQuantity)
          ? newQuantity
          : 0,
      });
      setCustomQuantity(!QUANTITY_OPTIONS.includes(newQuantity));
    }
  };

  // Handle buy mode change
  const handleBuyModeChange = (mode: 'fixed' | 'infinity') => {
    setBuyMode(mode);

    if (mode === 'infinity') {
      form.setFieldsValue({
        quantity: undefined,
        amount: undefined,
      });
    } else {
      const newQuantity = 100;
      const newAmount = price * newQuantity;

      setQuantity(newQuantity);
      setAmount(newAmount);
      setCustomQuantity(false);

      form.setFieldsValue({
        quantity: newQuantity,
        amount: newAmount,
        quantityOption: newQuantity,
      });
    }
  };

  return (
    <Modal
      centered
      open={props.open}
      title={
        <div className="flex flex-col">
          <div className="text-lg font-bold">購買點數</div>
          <div className="text-sm text-gray-400">平台手續費 - 0%</div>
        </div>
      }
      cancelText="取消"
      okText="確認發佈"
      width={isMobile ? '95%' : 520}
      styles={{
        body: { padding: '16px 0px' },
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
        initialValues={{
          price: 1,
          quantity: 100,
          amount: 100,
          buyMode: 'fixed',
          quantityOption: 100,
        }}
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
              tooltip="您願意為每點支付的價格"
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
              label="收購模式"
              name="buyMode"
              tooltip="選擇固定數量或無限收購"
            >
              <Radio.Group
                onChange={(e) => handleBuyModeChange(e.target.value)}
                value={buyMode}
                buttonStyle="solid"
                className="w-full"
              >
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Radio.Button value="fixed" className="w-full text-center">
                      <Space>
                        <span>固定數量</span>
                      </Space>
                    </Radio.Button>
                  </Col>
                  <Col span={12}>
                    <Radio.Button
                      value="infinity"
                      className="w-full text-center"
                    >
                      <Space>
                        <SwapOutlined />
                        <span>無限收購</span>
                      </Space>
                    </Radio.Button>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          </Col>

          {buyMode === 'fixed' && (
            <>
              <Col span={24}>
                <Form.Item
                  label="點數數量"
                  name="quantityOption"
                  tooltip="選擇或輸入您想收購的點數數量"
                >
                  <Radio.Group
                    onChange={(e) => handleQuantityOptionChange(e.target.value)}
                    buttonStyle="solid"
                    className="w-full"
                  >
                    <Row gutter={[8, 8]}>
                      {QUANTITY_OPTIONS.map((option) => (
                        <Col span={8} key={option}>
                          <Radio.Button
                            value={option}
                            className="w-full text-center"
                          >
                            {formatNumber(option)}
                          </Radio.Button>
                        </Col>
                      ))}
                      <Col span={8}>
                        <Radio.Button value={0} className="w-full text-center">
                          自定義
                        </Radio.Button>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {customQuantity ? (
                <Col span={24}>
                  <Form.Item
                    label="自定義數量"
                    rules={[
                      {
                        required: customQuantity,
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
                      onChange={handleQuantityChange}
                      value={quantity}
                      formatter={numberFormatter}
                      parser={(value) => parseFloat(numberParser(value))}
                    />
                  </Form.Item>
                </Col>
              ) : (
                // Hidden form item to ensure quantity is always submitted
                <Form.Item name="quantity" hidden={true} />
              )}

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
                      required: buyMode === 'fixed',
                      message: '請輸入總額',
                    },
                  ]}
                  name="amount"
                  tooltip="收購總金額 = 單價 × 數量"
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
            </>
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
              tooltip="添加關於此交易的額外信息"
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
          title={
            <div className="flex items-center">
              <span>交易摘要</span>
              <Tooltip title="此摘要顯示您的訂單信息">
                <QuestionCircleOutlined className="ml-2 text-gray-400" />
              </Tooltip>
            </div>
          }
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
              <Text type="secondary">收購點數:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong>
                {buyMode === 'infinity' ? (
                  <span className="flex items-center justify-end">
                    <SwapOutlined className="mr-1" /> 無限
                  </span>
                ) : (
                  `${formatNumber(quantity)} 點`
                )}
              </Text>
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
              <Text strong>預計支出:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text strong type="danger">
                {buyMode === 'infinity' ? (
                  <span className="flex items-center justify-end">
                    <SwapOutlined className="mr-1" /> 無限
                  </span>
                ) : (
                  `${formatNumber(amount, 2)} NT$`
                )}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Help Text */}
        {buyMode === 'infinity' && (
          <div
            className="mt-4 p-3 rounded-md"
            style={{
              backgroundColor: 'rgba(201, 168, 107, 0.15)',
              border: '1px solid rgba(201, 168, 107, 0.3)',
            }}
          >
            <InfoCircleOutlined className="mr-2" style={{ color: '#c9a86b' }} />
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              無限收購模式下，系統將按照您設定的單價收購所有可用的點數，直到您取消訂單。
            </Text>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default BuyPublishModal;
