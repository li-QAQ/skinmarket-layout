import { RightOutlined } from '@ant-design/icons';

const FilterTag = () => {
  const itmes = [
    {
      label: '類型',
    },
    {
      label: '價格',
    },
    {
      label: '品牌',
    },
    {
      label: '尺寸',
    },
  ];

  return (
    <div className="w-52 h-full bg-[var(--secondary)] space-y-6 p-4">
      {itmes.map((item, index) => {
        return (
          <div
            key={index}
            className="flex font-bold justify-between text-sm cursor-pointer"
          >
            <span>{item.label}</span>
            <RightOutlined />
          </div>
        );
      })}
    </div>
  );
};

export default FilterTag;
