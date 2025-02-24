import { Button, Form, Input, InputNumber, Modal, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Api from '@/api';

interface KYCModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const KYCModal = (props: KYCModalProps) => {
  const [form] = Form.useForm();

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
      const res = Api.Member.post_kyc(formData).then(() => {
        message.success('提交成功');
        handleClose();
      });

      console.log(res);

      // const res = await fetch('/api/kyc', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (res.ok) {
      //   message.success('提交成功');
      //   handleClose();
      // } else {
      //   message.error('提交失敗');
      // }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Modal centered open={props.open} onCancel={handleClose} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="real_name"
          label="姓名"
          rules={[{ required: true, message: '請輸入' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手機號碼"
          rules={[{ required: true, message: '請輸入' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <div className="flex space-x-4">
          <Form.Item
            label="身份證正面"
            name="image_id_front"
            extra="請上傳身份證正面照片"
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

          <Form.Item
            label="身份證反面"
            name="image_id_back"
            extra="請上傳身份證反面照片"
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
        </div>

        <Form.Item
          label="第二證件"
          name="image_second_id"
          valuePropName="fileList"
          getValueFromEvent={normFile}
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

export default KYCModal;
