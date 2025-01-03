import Image from "next/image";

interface MyCardProps {
  image: {
    src: string;
    width: number;
    height: number;
  };
}
const MyCard = (props: MyCardProps) => {
  return (
    <div className="bg-[var(--secondary)] rounded-md flex justify-center items-center relative w-full hover:bg-slate-700 cursor-pointer">
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

export default MyCard;
