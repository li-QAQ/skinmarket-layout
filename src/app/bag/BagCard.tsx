'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BagCardProps {
  image: {
    src: string;
    width: number;
    height: number;
  };
  name: string;
  price: number;
  selected: boolean;
  onSelect?: (select: boolean) => void;
}
const BagCard = (props: BagCardProps) => {
  const [isSelect, setIsSelect] = useState(false);

  useEffect(() => {
    props.onSelect?.(isSelect);
  }, [isSelect]);

  useEffect(() => {
    setIsSelect(props.selected);
  }, [props.selected]);

  return (
    <div
      className="bg-[var(--secondary)] h-[230px] rounded-md flex justify-center items-center relative w-full hover:bg-slate-700 cursor-pointer"
      style={{
        border: isSelect ? '2px solid var(--primary)' : '2px solid transparent',
      }}
      onClick={() => setIsSelect(!isSelect)}
    >
      <Image
        src={props.image.src}
        width={props.image.width}
        height={props.image.height}
        alt="aug.png"
      />
      <div className="absolute p-2 w-full h-full flex flex-col justify-end text-sm">
        <div className="text-xs">{props.name}</div>
        <div className="flex justify-between">
          <span>{props.price}</span>
          <span>在售23</span>
        </div>
      </div>
    </div>
  );
};

export default BagCard;
