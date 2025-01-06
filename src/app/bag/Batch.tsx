import useBag from '@/store/bagStore';
import { Button, Checkbox, CheckboxProps } from 'antd';
import PricingModal from './Pricing';

const BagBatch = () => {
  const {
    items,
    selectedItemIds,
    getSelectedCount,
    setSelectedItemIds,
    getAllItemCount,
    getSelectedItmeTotalPrice,
    setIsOpenPricingModal,
  } = useBag();

  const AllIds = items.map((item) => item.id);

  const onChange: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      setSelectedItemIds(AllIds);
    } else {
      setSelectedItemIds([]);
    }
  };

  const openPricingModal = () => {
    setIsOpenPricingModal(true);
  };
  return (
    <div
      className="fixed left-0 bottom-0 w-full"
      style={{ background: 'var(--secondary)' }}
    >
      <PricingModal />
      <div className="flex justify-between items-center  p-6 ">
        <div>
          <span>
            <Checkbox
              checked={
                selectedItemIds.length > 0 &&
                selectedItemIds.length === items.length
              }
              indeterminate={
                selectedItemIds.length > 0 &&
                selectedItemIds.length < items.length
              }
              onChange={onChange}
            >
              全選
            </Checkbox>
          </span>
          {`${getSelectedCount()}/${getAllItemCount()}`}
        </div>
        <div className="space-x-4">
          <span className="font-bold">
            估值: ${getSelectedItmeTotalPrice()}
          </span>
          <Button type="primary" className="w-60" onClick={openPricingModal}>
            上架
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BagBatch;
