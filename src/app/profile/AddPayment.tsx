import { Button, Form, Input, Modal, Select, message } from 'antd';

import Api from '@/api';
import { useRouter } from 'next/navigation';

interface AddPaymentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddPayment = (props: AddPaymentProps) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSubmit = async (values: any) => {
    const res = Api.Member.post_bank({
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
        message.success('銀行賬戶添加成功');

        router.refresh();
        handleClose();
      })
      .catch((err) => {
        console.log(err, 'err');
        message.error(err.data.message);
      });

    console.log(res, 'res');
  };

  return (
    <Modal
      title="添加收款方式"
      centered
      open={props.open}
      onCancel={handleClose}
      footer={null}
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
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="payment_method"
            label="收款方式"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Select options={[{ label: '銀行轉帳', value: 'bank' }]} />
          </Form.Item>

          <Form.Item
            name="account_holder_name"
            label="持有人姓名"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="iban"
            label="IBAN"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="account_code"
            label="帳戶代號"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="account_number"
            label="銀行帳號"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="bank_code"
            label="銀行代碼"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="bank_name"
            label="銀行名稱"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="swift_code"
            label="SWIFT CODE"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="country_code"
            label="國家"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input disabled style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="currency_code"
            label="貨幣代碼"
            rules={[{ required: true, message: '請輸入' }]}
          >
            <Input disabled style={{ width: '100%' }} />
          </Form.Item>
        </div>

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

export default AddPayment;
