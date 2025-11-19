import { useState, useRef, useEffect } from "react";

const tabs = ["All", "Active", "Upcoming", "Completed"];

export default function SlidingTabs({ onChange }: { onChange: (i: number) => void }) {
  const [activeTab, setActiveTab] = useState(0); // Start on "All"
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({
        width: el.offsetWidth,
        left: el.offsetLeft,
      });
    }
  }, [activeTab]);

  return (
    <div className="border-y border-[#ebe8e5] relative w-full pt-4 px-14">
      {/* Tabs */}
      <div className="flex gap-8 px-4 py-2 text-gray-600 text-sm">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            ref={el => {
              tabRefs.current[i] = el!;
            }}
            onClick={() => {
              setActiveTab(i);
              onChange(i); // 🔥 notify parent
            }}
            className={`pb-2 transition-colors hover:underline px-4 ${
              activeTab === i ? "text-black" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sliding Underline */}
      <span
        className="absolute bottom-0 h-0.5 bg-black transition-all duration-300"
        style={indicatorStyle}
      />
    </div>
  );
}
