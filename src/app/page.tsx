import FilterTag from "@/components/FIlterTag";
import MyCard from "@/components/MyCard";

export default function Home() {
  return (
    <div className="w-full h-full flex">
      <div className="max-md:hidden mr-4">
        <FilterTag />
      </div>
      <div
        className="overflow-auto w-full"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          scrollbarWidth: "none",
        }}
      >
        {Array.from({ length: 40 }).map((_, index) => {
          return (
            <MyCard
              key={index}
              image={{
                src: "/images/aug.png",
                width: 140,
                height: 140,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
