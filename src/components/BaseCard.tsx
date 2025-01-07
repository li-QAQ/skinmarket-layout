import Image from 'next/image';

interface BaseCardProps {
  image: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
const BaseCard = (props: BaseCardProps) => {
  return (
    <div
      onClick={props.onClick}
      className={`relative rounded-md ${props.className}`}
      style={{
        backgroundColor: 'var(--secondary)',
        aspectRatio: '1/1',
        ...props.style,
      }}
    >
      <div className="flex absolute w-full h-full justify-center items-center">
        <Image
          src={props.image}
          fill
          sizes="100%"
          style={{
            objectFit: 'contain',
            userSelect: 'none',
          }}
          alt={props.image}
        />
      </div>

      <div className="absolute bottom-0 p-2">{props.children}</div>
    </div>
  );
};

export default BaseCard;
