import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  Typography,
  Space,
  Divider,
  Alert,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import Api from '@/api';
import useMessageStore from '@/store/message';
import { useState } from 'react';

const { Text } = Typography;

interface KYCModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const KYCModal = (props: KYCModalProps) => {
  const [form] = Form.useForm();
  const setMessage = useMessageStore((state) => state.setData);
  const [submitting, setSubmitting] = useState(false);

  // 處理 Upload 的事件，回傳 fileList
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleClose = () => {
    if (submitting) return; // 提交中不允许关闭
    form.resetFields(); // 重置表单
    props.setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const formData = new FormData();

    formData.append('real_name', values.real_name);
    formData.append('phone', values.phone);
    formData.append('address', values.address || '');

    // 取得身份證正面檔案
    if (values.image_id_front && values.image_id_front[0]) {
      formData.append('image_id_front', values.image_id_front[0].originFileObj);
    }
    // 取得身份證反面檔案
    if (values.image_id_back && values.image_id_back[0]) {
      formData.append('image_id_back', values.image_id_back[0].originFileObj);
    }
    // 取得第二證件（如果有上傳）
    if (values.image_second_id && values.image_second_id[0]) {
      formData.append(
        'image_second_id',
        values.image_second_id[0].originFileObj,
      );
    }

    try {
      // 提交 KYC 验证
      await Api.Member.post_kyc(formData);

      setMessage({
        show: true,
        content: 'KYC 驗證資料提交成功，請等待審核',
        type: 'success',
      });

      handleClose();

      // 刷新页面以显示最新状态
      window.location.reload();
    } catch (error: any) {
      setMessage({
        show: true,
        content: error.message || '提交失敗，請檢查您的資料',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      centered
      open={props.open}
      onCancel={handleClose}
      footer={null}
      width={700}
      title={
        <div className="flex items-center">
          <IdcardOutlined className="mr-2 text-blue-400" />
          <span className="text-lg font-medium">KYC 身份認證</span>
        </div>
      }
      className="responsive-modal"
      maskClosable={!submitting}
      closable={!submitting}
    >
      <Divider className="mt-3 mb-6" />

      <Alert
        message="為什麼需要 KYC 驗證？"
        description="KYC（了解您的客戶）驗證是為了確保交易安全和合規。您的個人資料將被安全存儲，僅用於身份驗證目的。"
        type="info"
        showIcon
        className="mb-6"
      />

      <Spin spinning={submitting} tip="提交中...">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark="optional"
          className="mt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Form.Item
              name="real_name"
              label={
                <Space>
                  <IdcardOutlined />
                  <span>姓名</span>
                </Space>
              }
              rules={[{ required: true, message: '請輸入您的真實姓名' }]}
              className="col-span-1"
              tooltip="請輸入您的真實姓名，需與證件一致"
            >
              <Input placeholder="請輸入您的真實姓名" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <Space>
                  <PhoneOutlined />
                  <span>手機號碼</span>
                </Space>
              }
              rules={[
                { required: true, message: '請輸入您的手機號碼' },
                {
                  pattern: /^[0-9]+$/,
                  message: '手機號碼只能包含數字',
                },
              ]}
              className="col-span-1"
              tooltip="請輸入您的手機號碼，用於身份驗證"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="請輸入您的手機號碼"
                controls={false}
                maxLength={15}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <Space>
                <HomeOutlined />
                <span>居住地址</span>
              </Space>
            }
            name="address"
            tooltip="請輸入您的居住地址，用於身份驗證"
          >
            <Input.TextArea
              placeholder="請輸入您的居住地址"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Divider orientation="left">
            <Text type="secondary">證件上傳</Text>
          </Divider>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-2">
            <Form.Item
              label={
                <Space>
                  <IdcardOutlined />
                  <span>身份證正面</span>
                </Space>
              }
              name="image_id_front"
              extra="請上傳清晰的身份證正面照片"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '請上傳身份證正面照片' }]}
              className="col-span-1"
            >
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                maxCount={1}
                accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上傳正面</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <IdcardOutlined />
                  <span>身份證反面</span>
                </Space>
              }
              name="image_id_back"
              extra="請上傳清晰的身份證反面照片"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '請上傳身份證反面照片' }]}
              className="col-span-1"
            >
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                maxCount={1}
                accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上傳反面</div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item
            label={
              <Space>
                <IdcardOutlined />
                <span>第二證件（選填）</span>
              </Space>
            }
            name="image_second_id"
            extra="您可以上傳駕照、護照等其他證件作為輔助驗證"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mt-2"
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
              accept="image/*"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上傳證件</div>
              </div>
            </Upload>
          </Form.Item>

          <Alert
            message={
              <Space>
                <InfoCircleOutlined />
                <span>隱私保護聲明</span>
              </Space>
            }
            description="您上傳的證件照片僅用於身份驗證，我們將嚴格保護您的個人隱私。請確保上傳的照片清晰可見，以便快速通過審核。"
            type="warning"
            showIcon={false}
            className="mt-4 mb-6"
          />

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
            <Button
              onClick={handleClose}
              className="w-full sm:w-auto"
              disabled={submitting}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full sm:w-auto"
              loading={submitting}
            >
              提交驗證
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default KYCModal;
