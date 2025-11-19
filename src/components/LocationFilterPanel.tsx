import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

interface LocationFilterPanelProps {
  onBack: () => void;
  onApply: (selected: string[]) => void;
  options: string[];
  defaultSelected?: string[];
}

export default function LocationFilterPanel({
  onBack,
  onApply,
  options,
  defaultSelected = [],
}: LocationFilterPanelProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [search, setSearch] = useState("");

  const toggle = (loc: string) => {
    setSelected(prev => (prev.includes(loc) ? prev.filter(x => x !== loc) : [...prev, loc]));
  };

  const only = (loc: string) => {
    setSelected([loc]);
  };

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-[380px] bg-white shadow-xl border border-[#e5e3d7] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e7dd]">
        <button onClick={onBack}>
          <ArrowLeft className="text-gray-700" size={20} />
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm focus:outline-none"
        />
      </div>

      {/* Checkbox list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(loc => {
          const isSelected = selected.includes(loc);
          return (
            <div
              key={loc}
              className="flex items-center justify-between px-4 py-3 hover:bg-[#f7f6f2] group cursor-pointer"
            >
              {/* Checkbox + label */}
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => toggle(loc)}>
                <div
                  className={`w-4 h-4 border flex items-center justify-center ${
                    isSelected ? "bg-green-600 border-green-600" : "border-gray-400"
                  }`}
                >
                  {isSelected && <Check className="text-white" size={14} />}
                </div>

                <span className="text-sm text-gray-800">{loc}</span>
              </label>

              {/* Only */}
              <button
                onClick={() => only(loc)}
                className="text-xs text-gray-600 underline opacity-0 group-hover:opacity-100"
              >
                Only
              </button>
            </div>
          );
        })}
      </div>

      {/* Apply button */}
      <div className="border-t border-[#e8e7dd] px-4 py-3 flex justify-end bg-white">
        <button onClick={() => onApply(selected)} className="text-sm underline text-gray-700">
          Apply
        </button>
      </div>
    </div>
  );
}
