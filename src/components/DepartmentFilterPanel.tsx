import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

interface DepartmentFilterPanelProps {
  onBack: () => void;
  onApply: (selected: string[]) => void;
  options: string[];
  defaultSelected?: string[];
}

export default function DepartmentFilterPanel({
  onBack,
  onApply,
  options,
  defaultSelected = [],
}: DepartmentFilterPanelProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [search, setSearch] = useState("");

  const toggle = (dept: string) => {
    setSelected(prev => (prev.includes(dept) ? prev.filter(x => x !== dept) : [...prev, dept]));
  };

  const only = (dept: string) => {
    setSelected([dept]);
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
        {filtered.map(dept => {
          const isSelected = selected.includes(dept);
          return (
            <div
              key={dept}
              className="flex items-center justify-between px-4 hover:bg-[#f7f6f2] group cursor-pointer"
            >
              {/* Checkbox + label */}
              <label
                className="flex items-center gap-3 cursor-pointer py-3 w-full"
                onClick={() => toggle(dept)}
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center ${
                    isSelected ? "bg-green-600 border-green-600" : "border-gray-400"
                  }`}
                >
                  {isSelected && <Check className="text-white" size={14} />}
                </div>

                <span className="text-sm text-gray-800">{dept}</span>
              </label>

              {/* Only */}
              <button
                onClick={() => only(dept)}
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
