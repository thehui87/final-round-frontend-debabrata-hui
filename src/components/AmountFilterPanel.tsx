import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface AmountFilterPanelProps {
  onBack: () => void;
  onApply: (min: number | null, max: number | null) => void;
  defaultMin?: number | null;
  defaultMax?: number | null;
}

export default function AmountFilterPanel({
  onBack,
  onApply,
  defaultMin = null,
  defaultMax = null,
}: AmountFilterPanelProps) {
  const [min, setMin] = useState(defaultMin ?? "");
  const [max, setMax] = useState(defaultMax ?? "");

  return (
    <div className="w-[380px] bg-white shadow-xl border border-[#e5e3d7]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e7dd]">
        <button onClick={onBack}>
          <ArrowLeft className="text-gray-700" size={20} />
        </button>
        <span className="text-sm font-medium">Amount</span>
      </div>

      {/* Body */}
      <div className="px-3 py-3 space-y-4 border-b border-[#e8e7dd]">
        <p className="text-xs text-left text-gray-600">Enter a range to filter by trip spend.</p>

        <div className="flex items-center gap-4">
          {/* Min */}
          <div className="flex items-center border px-3 py-2 w-full">
            <span className="text-gray-500 mr-1">$</span>
            <input
              type="number"
              value={min}
              onChange={e => setMin(e.target.value)}
              className="w-full focus:outline-none text-sm"
            />
          </div>

          <span className="text-gray-600">—</span>

          {/* Max */}
          <div className="flex items-center border px-3 py-2 w-full">
            <span className="text-gray-500 mr-1">$</span>
            <input
              type="number"
              value={max}
              onChange={e => setMax(e.target.value)}
              className="w-full focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => onApply(min === "" ? null : Number(min), max === "" ? null : Number(max))}
          className="px-5 py-2 bg-[#e8f001] text-black font-medium text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
