import { Button, Form, Input, InputNumber, Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface KYCModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const KYCModal = (props: KYCModalProps) => {
  const [form] = Form.useForm();
  const hanldleClose = () => {
    props.setOpen(false);
  };

  const hanldleOk = () => {
    props.setOpen(false);
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <Modal
      centered
      open={props.open}
      onCancel={hanldleClose}
      onOk={hanldleOk}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: '請輸入',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手機號碼"
          rules={[
            {
              required: true,
              message: '請輸入',
            },
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
        <div className="flex space-x-4">
          <Form.Item
            label="身份證正面"
            name="credit_front"
            rules={[
              {
                required: true,
                message: '請選擇',
              },
            ]}
          >
            <Upload action="/upload.do" listType="picture-card" maxCount={1}>
              <button type="button">
                <PlusOutlined />
                <div>上傳圖片</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="身份證反面"
            name="credit_back"
            rules={[
              {
                required: true,
                message: '請選擇',
              },
            ]}
          >
            <Upload action="/upload.do" listType="picture-card" maxCount={1}>
              <button type="button">
                <PlusOutlined />
                <div>上傳圖片</div>
              </button>
            </Upload>
          </Form.Item>
        </div>
        <Form.Item label="第二證件">
          <Upload action="/upload.do" listType="picture-card" maxCount={1}>
            <button type="button">
              <PlusOutlined />
              <div>上傳圖片</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item label="居住地址" name="address">
          <Input />
        </Form.Item>

        <div className="flex justify-end space-x-4">
          <Button type="primary" onClick={hanldleClose}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            確認
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default KYCModal;
