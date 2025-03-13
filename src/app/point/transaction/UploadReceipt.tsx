import {
  Button,
  Form,
  Modal,
  Upload,
  Steps,
  Typography,
  Divider,
  Card,
  Collapse,
  Spin,
} from 'antd';
import {
  BankOutlined,
  BarcodeOutlined,
  CreditCardOutlined,
  UserOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import Api from '@/api';
import { useEffect, useState } from 'react';
import useMessageStore from '@/store/message';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Theme color
const themeColor = '#c9a86b';

interface UploadReceiptProps {
  traderId: string | undefined;
  confirmId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UploadReceipt = (props: UploadReceiptProps) => {
  const [form] = Form.useForm();
  const [banks, setBanks] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const setMessage = useMessageStore((state) => state.setData);

  const handleClose = () => {
    setCurrentStep(0);
    setFileList([]);
    form.resetFields();
    props.setOpen(false);
  };

  // 完成並刷新頁面
  const handleComplete = () => {
    handleClose();
    // 刷新當前頁面
    window.location.reload();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // 取得收據檔案
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('proof_image', fileList[0].originFileObj);
      } else {
        setMessage({
          show: true,
          content: '請上傳付款證明',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      await Api.Member.post_upload_receipt(props.confirmId, formData);

      setMessage({
        show: true,
        content: '付款證明提交成功',
        type: 'success',
      });

      setCurrentStep(2); // Move to success step
      setLoading(false);
    } catch (error: any) {
      setMessage({
        show: true,
        content: error.message || '提交失敗，請重試',
        type: 'error',
      });
      setLoading(false);
    }
  };

  // 處理 Upload 的事件，回傳 fileList
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // 複製文字到剪貼簿
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setMessage({
          show: true,
          content: '已複製到剪貼簿',
          type: 'success',
        });
      },
      (err) => {
        console.error('無法複製: ', err);
      },
    );
  };

  useEffect(() => {
    if (props.open && props.traderId) {
      setCurrentStep(0);
      setFileList([]);
      form.resetFields();
      setLoadingBanks(true);

      Api.Member.get_public_payment_method(props.traderId)
        .then((res) => {
          setBanks(res.data?.bank_list || []);
          setLoadingBanks(false);
        })
        .catch(() => {
          setMessage({
            show: true,
            content: '獲取銀行資訊失敗',
            type: 'error',
          });
          setLoadingBanks(false);
        });
    }
  }, [props.open, props.traderId, props.confirmId]);

  const BankInfoItem = ({
    icon,
    label,
    value,
    copyable = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    copyable?: boolean;
  }) => (
    <div className="flex items-center mb-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#c9a86b]/10 flex items-center justify-center mr-3">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-white font-medium flex items-center">
          <span className={copyable ? 'font-mono' : ''}>{value}</span>
          {copyable && (
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(value)}
              className="ml-2 text-[#c9a86b] hover:text-[#d9b87b]"
            />
          )}
        </div>
      </div>
    </div>
  );

  const steps = [
    {
      title: '確認收款資訊',
      content: (
        <div className="space-y-4">
          <Paragraph className="text-gray-400">
            請確認以下收款帳戶資訊，並按照指示進行轉帳操作。完成轉帳後，請點擊「下一步」上傳付款證明。
          </Paragraph>

          {loadingBanks ? (
            <div className="flex justify-center py-12">
              <Spin
                indicator={
                  <div className="flex flex-col items-center">
                    <Spin size="large" />
                    <div className="mt-3 text-gray-400">加載銀行資訊中...</div>
                  </div>
                }
              />
            </div>
          ) : banks.length === 0 ? (
            <div className="text-center py-8">
              <InfoCircleOutlined
                style={{ fontSize: '32px', color: '#faad14' }}
              />
              <Text type="secondary" className="block mt-3">
                未找到銀行資訊
              </Text>
            </div>
          ) : (
            <div className="space-y-4">
              {banks.map((bank: any, index: number) => (
                <Card
                  key={index}
                  className="bg-gray-800/60 border-gray-700/50 hover:border-[#c9a86b]/30 transition-all"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="mb-3">
                    <Text strong className="text-[#c9a86b] text-lg">
                      收款帳戶 {index + 1}
                    </Text>
                  </div>

                  <BankInfoItem
                    icon={<BankOutlined className="text-[#c9a86b]" />}
                    label="銀行名稱"
                    value={bank.bank_name}
                  />

                  <BankInfoItem
                    icon={<BarcodeOutlined className="text-[#c9a86b]" />}
                    label="銀行代碼"
                    value={bank.bank_code}
                    copyable
                  />

                  <BankInfoItem
                    icon={<CreditCardOutlined className="text-[#c9a86b]" />}
                    label="銀行帳號"
                    value={bank.account_number}
                    copyable
                  />

                  <BankInfoItem
                    icon={<UserOutlined className="text-[#c9a86b]" />}
                    label="帳戶名稱"
                    value={bank.account_holder_name}
                    copyable
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '上傳付款證明',
      content: (
        <div className="space-y-4">
          <Paragraph className="text-gray-400">
            請上傳您的付款證明截圖或照片。確保圖片清晰可見，包含交易日期、金額和收款方資訊。
          </Paragraph>

          <Card
            className="bg-gray-800/60 border-gray-700/50"
            style={{ borderRadius: '12px' }}
          >
            <div className="text-center mb-4">
              <Title level={5} style={{ color: 'white', margin: 0 }}>
                上傳付款證明
              </Title>
            </div>

            <div className="upload-area p-4 border border-dashed border-[#c9a86b]/30 rounded-lg bg-[#c9a86b]/5 mb-4">
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                maxCount={1}
                className="upload-receipt-container"
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}
              >
                {fileList.length === 0 && (
                  <Button
                    icon={<UploadOutlined />}
                    style={{
                      height: '100px',
                      width: '100%',
                      borderColor: 'rgba(201, 168, 107, 0.3)',
                      backgroundColor: 'rgba(201, 168, 107, 0.05)',
                      color: themeColor,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-base mt-2">點擊上傳付款證明</div>
                      <div className="text-xs text-gray-400 mt-1">
                        或拖拽文件到此處
                      </div>
                    </div>
                  </Button>
                )}
              </Upload>
            </div>

            <Collapse ghost className="bg-transparent" expandIconPosition="end">
              <Panel
                header={<Text className="text-[#c9a86b]">上傳說明</Text>}
                key="1"
                className="bg-transparent"
              >
                <ul className="list-disc pl-5 text-sm text-gray-400 space-y-2">
                  <li>支持 JPG, PNG, PDF 格式的文件</li>
                  <li>文件大小不超過 5MB</li>
                  <li>確保圖片清晰可讀，包含交易日期、金額和收款方資訊</li>
                  <li>如果是手機銀行轉帳，請截圖轉帳成功頁面</li>
                  <li>如果是ATM轉帳，請拍攝ATM交易憑證</li>
                </ul>
              </Panel>
            </Collapse>
          </Card>
        </div>
      ),
    },
    {
      title: '提交成功',
      content: (
        <div className="text-center py-8 space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#c9a86b]/10 flex items-center justify-center">
              <CheckCircleOutlined
                style={{ fontSize: '48px', color: themeColor }}
              />
            </div>
          </div>
          <Title level={4} style={{ color: 'white' }}>
            付款證明提交成功
          </Title>
          <Paragraph className="text-gray-400 max-w-md mx-auto">
            您的付款證明已成功提交，賣家將會審核您的付款證明。審核通過後，交易將會完成。您可以在交易列表中查看審核狀態。
          </Paragraph>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Modal
      title={
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <span className="text-lg font-medium mb-2 sm:mb-0">付款流程</span>
          <div className="w-full sm:ml-4 sm:flex-1">
            <Steps
              current={currentStep}
              size="small"
              className="payment-steps"
              items={steps.map((item) => ({ title: item.title }))}
              responsive={false}
            />
          </div>
        </div>
      }
      centered
      open={props.open}
      onCancel={handleClose}
      footer={null}
      width={700}
      className="upload-receipt-modal"
    >
      <Form form={form} className="hidden">
        {/* Hidden form element to connect the form instance */}
        <Form.Item name="dummy"></Form.Item>
      </Form>

      <Divider
        style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0 24px' }}
      />

      <div className="steps-content mb-6">{steps[currentStep].content}</div>

      <div className="flex justify-between">
        {currentStep === 2 ? (
          <Button
            type="primary"
            onClick={handleComplete}
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
            size="large"
            icon={<ReloadOutlined />}
          >
            完成
          </Button>
        ) : (
          <>
            <Button
              onClick={currentStep === 0 ? handleClose : prevStep}
              icon={currentStep > 0 ? <ArrowLeftOutlined /> : undefined}
              size="large"
            >
              {currentStep === 0 ? '取消' : '上一步'}
            </Button>

            <Button
              type="primary"
              onClick={currentStep === 1 ? handleSubmit : nextStep}
              loading={currentStep === 1 && loading}
              icon={
                currentStep < 1 ? <ArrowRightOutlined /> : <UploadOutlined />
              }
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
              disabled={currentStep === 1 && fileList.length === 0}
              size="large"
            >
              {currentStep === 0 ? '下一步' : '提交付款證明'}
            </Button>
          </>
        )}
      </div>

      <style jsx global>{`
        .upload-receipt-modal .ant-upload-list-item-name {
          color: rgba(255, 255, 255, 0.85);
        }

        .upload-receipt-modal .ant-steps-item-process .ant-steps-item-icon {
          background-color: ${themeColor};
          border-color: ${themeColor};
        }

        .upload-receipt-modal .ant-steps-item-finish .ant-steps-item-icon {
          border-color: ${themeColor};
        }

        .upload-receipt-modal
          .ant-steps-item-finish
          .ant-steps-item-icon
          > .ant-steps-icon {
          color: ${themeColor};
        }

        .upload-receipt-modal
          .ant-steps-item-finish
          > .ant-steps-item-container
          > .ant-steps-item-content
          > .ant-steps-item-title::after {
          background-color: ${themeColor};
        }

        .upload-receipt-modal .ant-collapse-header {
          padding: 8px 0 !important;
        }

        .upload-receipt-modal .ant-collapse-content-box {
          padding: 0 0 8px 0 !important;
        }

        .upload-receipt-modal .ant-card-body {
          padding: 16px;
        }

        @media (max-width: 640px) {
          .payment-steps .ant-steps-item-title {
            font-size: 12px;
          }

          .upload-receipt-modal .ant-modal-body {
            padding: 16px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default UploadReceipt;
