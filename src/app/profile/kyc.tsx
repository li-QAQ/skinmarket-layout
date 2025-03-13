import { Button, Form, Input, InputNumber, Modal, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Api from '@/api';
import { useRouter } from 'next/navigation';

interface KYCModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const KYCModal = (props: KYCModalProps) => {
  const [form] = Form.useForm();
  const router = useRouter();

  // 處理 Upload 的事件，回傳 fileList
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    console.log('submit', values);
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
      Api.Member.post_kyc(formData).then(() => {
        message.success('提交成功');
        handleClose();
        router.refresh();
      });
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      centered
      open={props.open}
      onCancel={handleClose}
      footer={null}
      width={600}
      title="KYC 身份認證"
      className="responsive-modal"
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="mt-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Form.Item
            name="real_name"
            label="姓名"
            rules={[{ required: true, message: '請輸入' }]}
            className="col-span-1"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手機號碼"
            rules={[{ required: true, message: '請輸入' }]}
            className="col-span-1"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-2">
          <Form.Item
            label="身份證正面"
            name="image_id_front"
            extra="請上傳身份證正面照片"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '請選擇' }]}
            className="col-span-1"
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

          <Form.Item
            label="身份證反面"
            name="image_id_back"
            extra="請上傳身份證反面照片"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '請選擇' }]}
            className="col-span-1"
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
        </div>

        <Form.Item
          label="第二證件"
          name="image_second_id"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          className="mt-2"
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

        <Form.Item label="居住地址" name="address">
          <Input />
        </Form.Item>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
          <Button onClick={handleClose} className="w-full sm:w-auto">
            取消
          </Button>
          <Button type="primary" htmlType="submit" className="w-full sm:w-auto">
            確認
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default KYCModal;
