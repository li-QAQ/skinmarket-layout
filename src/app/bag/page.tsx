'use client';

import BaseCard from '@/components/BaseCard';
import { useEffect, useState } from 'react';

interface MCardProps {
  name: string;
  price: number;
  selected: boolean;
  onChange?: (selected: boolean) => void;
}
const MCard = (props: MCardProps) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

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
      image="/images/aug.png"
      children={
        <>
          <div className="text-xs">{props.name}</div>
          <div>{props.price}</div>
        </>
      }
    />
  );
};

const Bag = () => {
  const data = [
    {
      id: 1,
      selected: false,
      name: '點數100',
      price: 100,
      image: '/images/aug.png',
    },
    {
      id: 2,
      selected: false,
      name: '點數300',
      price: 300,
      image: '/images/aug.png',
    },
    {
      id: 3,
      selected: false,
      name: '點數500',
      price: 500,
      image: '/images/aug.png',
    },
  ];
  const [items, setItems] = useState(data);

  useEffect(() => {
    console.log(items, 'items');
  }, [items]);

  return (
    <div className="w-full h-full flex">
      <div
        className="grid w-full h-full gap-4 overflow-auto"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, index) => (
          <MCard
            key={index}
            name={item.name}
            price={item.price}
            selected={item.selected}
            onChange={(selected) => {
              const newItems = [...items];
              newItems[index].selected = selected;
              setItems(newItems);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Bag;
