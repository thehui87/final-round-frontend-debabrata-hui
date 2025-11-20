import { useState } from "react";
import Tooltip from "./Tooltip";
import { categoryColors } from "../helper/colorCategory";

type SpendBarProps = {
  category: string;
  amount: number;
};

export default function SpendBar({ data }: { data: SpendBarProps[] }) {
  const [hover, setHover] = useState<{
    category: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="relative w-full h-1 rounded-full mt-3">
      {data.map((item, index) => (
        <div
          key={item.category}
          className="h-2 inline-block "
          style={{
            width: `${(item.amount / total) * 100}%`,
            backgroundColor: categoryColors[item.category],
            borderRight: index !== data.length - 1 ? "2px solid white" : "none",
          }}
          onMouseEnter={e =>
            setHover({
              category: item.category,
              amount: item.amount,
              x: e.clientX,
              y: e.clientY,
            })
          }
          onMouseLeave={() => setHover(null)}
        ></div>
      ))}

      {hover && (
        <div
          className="pointer-events-none"
          style={{
            position: "fixed",
            top: hover.y + 10,
            left: hover.x + 10,
          }}
        >
          <Tooltip
            category={hover.category}
            amount={hover.amount.toFixed(2)}
            color={categoryColors[hover.category]}
          />
        </div>
      )}
    </div>
  );
}
