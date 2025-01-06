"use client";
import BagCard from "@/app/bag/BagCard";
import BagBatch from "./Batch";
import useBag from "@/store/bagStore";
import { useEffect } from "react";

const Bag = () => {
  const setSelectedItemIds = useBag((state) => state.setSelectedItemIds);
  const items = useBag((state) => state.items);
  const setItems = useBag((state) => state.setItems);

  useEffect(() => {
    setItems([
      {
        id: 1,
        selected: false,
        name: "name1",
        price: 100,
        image: "/images/aug.png",
      },
      {
        id: 2,
        selected: false,
        name: "name2",
        price: 200,
        image: "/images/aug.png",
      },
      {
        id: 3,
        selected: false,
        name: "name3",
        price: 300,
        image: "/images/aug.png",
      },
    ]);
  }, []);

  return (
    <div className="w-full h-full flex">
      <BagBatch />
      <div
        className="overflow-auto w-full"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          scrollbarWidth: "none",
        }}
      >
        {items.map((item, index) => (
          <BagCard
            key={index}
            selected={item.selected as boolean}
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
