import { Button, Form, Modal, Upload, message } from 'antd';
import {
  PlusOutlined,
  BankOutlined,
  BarcodeOutlined,
  CreditCardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Api from '@/api';
import { useEffect, useState } from 'react';

interface UploadReceiptProps {
  traderId: string | undefined;
  confirmId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UploadReceipt = (props: UploadReceiptProps) => {
  const [form] = Form.useForm();
  const [banks, setBanks] = useState([]);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // 取得收據檔案
    if (values.proof_image && values.proof_image[0]) {
      formData.append('proof_image', values.proof_image[0].originFileObj);
    }

    try {
      const res = Api.Member.post_upload_receipt(
        props.confirmId,
        formData,
      ).then(() => {
        message.success('提交成功');
        handleClose();
      });

      console.log(res);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // 處理 Upload 的事件，回傳 fileList
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    if (props.traderId) {
      Api.Member.get_public_payment_method(props.traderId).then((res) => {
        setBanks(res.data?.bank_list);
      });
    }
  }, [props.confirmId]);

  return (
    <Modal
      title="上傳付款證明"
      centered
      open={props.open}
      onCancel={handleClose}
      footer={null}
    >
      <div className="mb-8 space-y-4">
        <h3 className="text-lg font-semibold text-white/90 mb-4">
          收款账户信息
        </h3>
        {banks.map((bank: any, index: number) => (
          <div
            key={index}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700/50 hover:border-blue-400/30 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* 银行名称 */}
              <div className="flex items-center space-x-2">
                <BankOutlined className="text-xl text-blue-400/80" />
                <div className="flex-1">
                  <div className="text-gray-400 text-xs">銀行名稱</div>
                  <div className="text-white/90 font-medium">
                    {bank.bank_name}
                  </div>
                </div>
              </div>

              {/* 银行代碼与帳號 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BarcodeOutlined className=" text-xl text-blue-400/80" />
                  <div>
                    <div className="text-gray-400 text-xs">銀行代碼</div>
                    <div className="text-white/90 font-mono">
                      {bank.bank_code}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCardOutlined className="text-xl text-blue-400/80" />
                  <div>
                    <div className="text-gray-400 text-xs">銀行帳號</div>
                    <div className="text-white/90 font-mono">
                      {bank.account_number}
                    </div>
                  </div>
                </div>
              </div>

              {/* 账户名称 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UserOutlined className="text-xl text-blue-400/80" />
                  <div>
                    <div className="text-gray-400 text-xs">帳戶名稱</div>
                    <div className="text-white/90">
                      {bank.account_holder_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="上傳付款證明"
          name="proof_image"
          extra="請上傳付款證明"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '請選擇' }]}
        >
          <Upload
            beforeUpload={() => false}
            listType="picture-card"
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div>上傳圖片</div>
            </div>
          </Upload>
        </Form.Item>

        <div className="flex justify-end space-x-4">
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" htmlType="submit">
            確認
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UploadReceipt;
