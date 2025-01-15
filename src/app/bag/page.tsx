'use client';

import BaseCard from '@/components/BaseCard';
import useBag from '@/store/bagStore';
import { useEffect, useState } from 'react';
import BagBatch from './Batch';
import { ShoppingOutlined } from '@ant-design/icons';

interface BagCardProps {
  image: string;
  name: string;
  price: number;
  stock: number;
  selected: boolean;
  onChange?: (selected: boolean) => void;
}

const BagCard = (props: BagCardProps) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(props.selected);
  }, []);

  useEffect(() => {
    props.onChange?.(selected);
  }, [selected]);

  return (
    <BaseCard
      onClick={() => setSelected(!selected)}
      style={{
        backgroundColor: selected ? 'var(--primary)' : 'var(--secondary)',
      }}
      className="hover:border-[var(--primary)] hover:border-2 cursor-pointer"
      image={props.image}
      Content={
        <div>
          <div className="text-xs">{props.name}</div>
          <div className="flex justify-between">
            <div>{props.price}</div>
            <div>
              <span>{props.stock}</span>
              <ShoppingOutlined />
            </div>
          </div>
        </div>
      }
    />
  );
};

const Bag = () => {
  const data = [
    {
      id: 1,
      selected: false,
      name: '點數',
      price: 1.02,
      stock: 11134,
      image: '/images/aug.png',
    },
    {
      id: 2,
      selected: false,
      name: 'AUG',
      price: 200,
      stock: 1,
      image: '/images/aug1.png',
    },
  ];

  const setItems = useBag((state) => state.setItems);
  const setSelectedItemIds = useBag((state) => state.setSelectedItemIds);
  const selectedItemIds = useBag((state) => state.selectedItemIds);
  const items = useBag((state) => state.items);

  useEffect(() => {
    setItems(data);
  }, []);

  return (
    <div className="w-full h-full flex">
      {selectedItemIds.length > 0 && <BagBatch />}
      <div
        className="grid w-full h-full gap-4 overflow-auto"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, index) => (
          <BagCard
            key={index}
            name={item.name}
            price={item.price}
            stock={item.stock}
            image={item.image}
            selected={selectedItemIds.includes(item.id)}
            onChange={(selected) => {
              if (selected) {
                setSelectedItemIds([...selectedItemIds, item.id]);
              } else {
                setSelectedItemIds(
                  selectedItemIds.filter((id) => id !== item.id),
                );
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Bag;
