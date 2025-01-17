import { Modal } from 'antd';

interface BuyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BuyModal = (props: BuyModalProps) => {
  <Modal
    open={props.open}
    onCancel={() => {
      props.setOpen(false);
    }}
    onOk={() => {
      props.setOpen(false);
    }}
  >
    <div>test</div>
  </Modal>;
};

export default BuyModal;
