import useAuthStore from '@/store/auth';
import { Button, Form, Input, Modal, Segmented } from 'antd';
import { useState } from 'react';

interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginModal = (props: LoginModalProps) => {
  const { setLogin } = useAuthStore();

  const [value, setValue] = useState('登入');
  const hanldleClose = () => {
    props.setOpen(false);
  };

  const hanldleOk = () => {
    props.setOpen(false);
  };

  const handleSubmit = () => {
    setLogin(true);
    props.setOpen(false);
  };

  return (
    <Modal
      centered
      open={props.open}
      onCancel={hanldleClose}
      onOk={hanldleOk}
      footer={null}
    >
      <div className="space-y-4">
        <Segmented
          options={['登入', '註冊']}
          onChange={(v) => {
            setValue(v);
          }}
        />
        {value === '登入' && (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="帳號">
              <Input />
            </Form.Item>
            <Form.Item label="密碼">
              <Input />
            </Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                登入
              </Button>
            </div>
          </Form>
        )}

        {value === '註冊' && (
          <Form layout="vertical">
            <Form.Item label="帳號">
              <Input />
            </Form.Item>
            <Form.Item label="密碼">
              <Input />
            </Form.Item>
            <Form.Item label="確認密碼">
              <Input />
            </Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                註冊
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
