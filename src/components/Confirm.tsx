import { Modal } from 'antd';

interface ConfirmProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const Confirm = ({ title, message, onConfirm, onCancel }: ConfirmProps) => {
  return (
    <Modal
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="確認"
      cancelText="取消"
    >
      <p>{message}</p>
    </Modal>
  );
};

export default Confirm;
