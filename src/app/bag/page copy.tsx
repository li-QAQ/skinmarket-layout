'use client';
import BagCard from '@/app/bag/BagCard';
import BagBatch from './Batch';
import useBag from '@/store/bagStore';
import { useEffect } from 'react';

const Bag = () => {
  const selectedItemIds = useBag((state) => state.selectedItemIds);
  const setSelectedItemIds = useBag((state) => state.setSelectedItemIds);
  const items = useBag((state) => state.items);
  const setItems = useBag((state) => state.setItems);

  useEffect(() => {
    setItems([
      {
        id: 1,
        selected: false,
        name: '點數',
        price: 100,
        image: '/images/aug.png',
      },
      {
        id: 2,
        selected: false,
        name: '點數',
        price: 200,
        image: '/images/aug.png',
      },
      {
        id: 3,
        selected: false,
        name: '點數',
        price: 300,
        image: '/images/aug.png',
      },
    ]);
  }, []);

  return (
    <div className="w-full h-full flex">
      <BagBatch />

      <div
        className="overflow-auto w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, index) => (
          <BagCard
            key={index}
            selected={
              selectedItemIds.length > 0 && selectedItemIds.includes(item.id)
            }
            name={item.name}
            price={item.price}
            onSelect={(select) => {
              if (select && !selectedItemIds.includes(item.id)) {
                setSelectedItemIds([...selectedItemIds, item.id]);
              } else if (!select && selectedItemIds.includes(item.id)) {
                setSelectedItemIds(
                  selectedItemIds.filter((id) => id !== item.id),
                );
              }
            }}
            image={{
              src: item.image,
              width: 140,
              height: 140,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Bag;
