"use client";

import type { DateRange } from "react-day-picker";
import { Calendar } from "../components/ui/calendar";
import { ChevronLeft } from "lucide-react";

export function DateRangePickerInline({
  value,
  onChange,
  onBack,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  onBack: () => void;
}) {
  return (
    <div className="bg-white w-full max-w-3xl mx-auto select-none h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-2 px-2 py-3 border-b">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-700 hover:text-black transition-colors duration-150"
          aria-label="Back"
          type="button"
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* CALENDAR */}
      <div className="px-2 py-4 overflow-auto grow">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value}
          onSelect={onChange}
          initialFocus
          className="max-w-full"
        />
      </div>
    </div>
  );
}
