import { Button, Form, Input, Modal, Select } from 'antd';

import Api from '@/api';
import useMessageStore from '@/store/message';

interface AddPaymentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddPayment = (props: AddPaymentProps) => {
  const [form] = Form.useForm();
  const setMessage = useMessageStore((state) => state.setData);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    Api.Member.post_bank({
      account_holder_name: values.account_holder_name,
      iban: values.iban,
      account_code: values.account_code,
      account_number: values.account_number,
      bank_code: values.bank_code,
      bank_name: values.bank_name,
      swift_code: values.swift_code,
      country_code: values.country_code,
      currency_code: values.currency_code,
    })
      .then(() => {
        setMessage({
          show: true,
          content: '銀行賬戶添加成功',
          type: 'success',
        });

        handleClose();

        if (props.onSuccess) {
          props.onSuccess();
        }
      })
      .catch((err) => {
        console.log(err, 'err');
        setMessage({
          show: true,
          content: err?.message,
          type: 'error',
        });
      });
  };

  return (
    <Modal
      title="添加收款方式"
      centered
      open={props.open}
      onCancel={handleClose}
      footer={null}
      width={600}
      className="responsive-modal"
    >
      <Form
        form={form}
        initialValues={{
          payment_method: 'bank',
          country_code: 'TW',
          currency_code: 'TWD',
        }}
        onFinish={handleSubmit}
        layout="vertical"
        className="mt-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Form.Item
            name="payment_method"
            label="收款方式"
            rules={[{ required: true, message: '請輸入' }]}
            className="col-span-1 sm:col-span-2"
          >
            <Select options={[{ label: '銀行轉帳', value: 'bank' }]} />
          </Form.Item>

          <Form.Item
            name="account_holder_name"
            label="持有人姓名"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="iban"
            label="IBAN"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="account_code"
            label="帳戶代號"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="account_number"
            label="銀行帳號"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bank_code"
            label="銀行代碼"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bank_name"
            label="銀行名稱"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="swift_code"
            label="SWIFT CODE"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="country_code"
            label="國家"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="currency_code"
            label="貨幣代碼"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input disabled />
          </Form.Item>
        </div>

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

export default AddPayment;
