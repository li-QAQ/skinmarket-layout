"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BagCardProps {
  image: {
    src: string;
    width: number;
    height: number;
  };
  selected: boolean;
}
const BagCard = (props: BagCardProps) => {
  const [isSelect, setIsSelect] = useState(false);

  useEffect(() => {
    setIsSelect(props.selected);
  }, [props.selected]);

  return (
    <div
      className="bg-[var(--secondary)] h-[230px] rounded-md flex justify-center items-center relative w-full hover:bg-slate-700 cursor-pointer"
      style={{
        border: isSelect ? "2px solid var(--primary)" : "2px solid transparent",
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
        <div className="text-xs">商品</div>
        <div className="flex justify-between">
          <span>$100</span>
          <span>在售23</span>
        </div>
      </div>
    </div>
  );
};

export default BagCard;
