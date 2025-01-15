'use client';

import BaseCard from '@/components/BaseCard';
import useSell from '@/store/sell';
import { useEffect, useState } from 'react';
import SellBatch from './Batch';
import { ShoppingOutlined } from '@ant-design/icons';

interface SellCardProps {
  name: string;
  price: number;
  stock: number;
  image: string;
  selected: boolean;
  onChange?: (selected: boolean) => void;
}

const SellCard = (props: SellCardProps) => {
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

const Sell = () => {
  const data = [
    {
      id: 1,
      selected: false,
      name: '點數',
      stock: 11134,
      price: 100,
      image: '/images/aug.png',
    },
  ];

  const setItems = useSell((state) => state.setItems);
  const setSelectedItemIds = useSell((state) => state.setSelectedItemIds);
  const selectedItemIds = useSell((state) => state.selectedItemIds);
  const items = useSell((state) => state.items);

  useEffect(() => {
    setItems(data);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {selectedItemIds.length > 0 && <SellBatch />}
      <div
        className="grid w-full h-full gap-4 overflow-auto"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, index) => (
          <SellCard
            key={index}
            name={item.name}
            price={item.price}
            image={item.image}
            stock={item.stock}
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

export default Sell;
