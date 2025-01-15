import { Button, Checkbox, CheckboxProps } from 'antd';
import PricingModal from './Pricing';
import useSell from '@/store/sell';

const SellBatch = () => {
  const {
    items,
    selectedItemIds,
    getSelectedCount,
    setSelectedItemIds,
    getAllItemCount,
    getSelectedItmeTotalPrice,
    setIsOpenPricingModal,
  } = useSell();

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
      <div className="flex justify-between items-center p-6">
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
          <span className="font-bold text-xl">
            估值: ${getSelectedItmeTotalPrice()}
          </span>
          <Button type="primary" className="w-60" onClick={openPricingModal}>
            改價
          </Button>
          <Button type="primary" className="w-60">
            下架
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellBatch;
