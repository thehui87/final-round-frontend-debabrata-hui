import { useState, useEffect, useRef } from "react";
import { ArrowRight, Calendar, Check } from "lucide-react";
// import { DateRangePicker } from "./DateRangePicker";
import { DateRangePickerInline } from "./DateRangePickerInline";
import type { DateRange } from "react-day-picker";
import { startOfToday, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { format } from "date-fns";

export default function DateRangeDropdown({
  range,
  setRange,
}: {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCustomRange, setShowCustomRange] = useState(false);

  const today = startOfToday();
  const yesterday = subDays(today, 1);
  const thisMonthStart = startOfMonth(today);
  const thisMonthEnd = endOfMonth(today);
  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  // Close when clicked outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCustomRange(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function isTodaySelected() {
    const today = startOfToday();
    return range?.from?.getTime() === today.getTime() && range?.to?.getTime() === today.getTime();
  }

  function isYesterdaySelected() {
    const yesterday = subDays(startOfToday(), 1);
    return (
      range?.from?.getTime() === yesterday.getTime() && range?.to?.getTime() === yesterday.getTime()
    );
  }

  function isThisMonthSelected() {
    const from = startOfMonth(new Date());
    const to = endOfMonth(new Date());
    return range?.from?.getTime() === from.getTime() && range?.to?.getTime() === to.getTime();
  }

  function isLastMonthSelected() {
    const lastMonth = subMonths(new Date(), 1);
    const from = startOfMonth(lastMonth);
    const to = endOfMonth(lastMonth);
    return range?.from?.getTime() === from.getTime() && range?.to?.getTime() === to.getTime();
  }

  function selectToday() {
    const today = startOfToday();
    setRange({ from: today, to: today });
    setOpen(false);
  }

  function selectYesterday() {
    const yesterday = subDays(startOfToday(), 1);
    setRange({ from: yesterday, to: yesterday });
    setOpen(false);
  }

  function selectThisMonth() {
    const from = startOfMonth(new Date());
    const to = endOfMonth(new Date());
    setRange({ from, to });
    setOpen(false);
  }

  function selectLastMonth() {
    const lastMonth = subMonths(new Date(), 1);
    const from = startOfMonth(lastMonth);
    const to = endOfMonth(lastMonth);
    setRange({ from, to });
    setOpen(false);
  }

  const safeFormat = (date: Date | undefined, fmt: string) => (date ? format(date, fmt) : "");

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative group flex items-center justify-center h-10 rounded-full ${
          range?.from && range?.to ? "px-4 w-36 gap-2" : "w-10"
        } ${
          open ? "bg-[#5c614b] text-white hover:bg-[#5c614b]" : " text-black hover:bg-[#f4f4f4]"
        } `}
      >
        <Calendar size={16} />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none bg-white text-black text-xs px-2 py-1 border border-[#ebe8e5] shadow transition-opacity duration-200">
          Trip Date
        </span>
        {range?.from && range?.to && (
          <div className="flex text-xs">
            {`${safeFormat(range?.from, "MMM d")} - ${safeFormat(range?.to, "MMM d")}`}
          </div>
        )}
      </button>

      {open && (
        <div
          className={`
    absolute bottom-3 left-1/2 translate-y-[-30px] 
    bg-white border border-[#e8e7dd] shadow-xl rounded-sm z-50
    flex flex-col
    ${showCustomRange ? "min-w-[500px] -translate-x-[70%]" : "min-w-[340px] -translate-x-[60%]"} 
    transition-all duration-200
  `}
        >
          {/* Options */}
          {!showCustomRange ? (
            <div className="flex flex-col justify-start items-start text-gray-900">
              {/* Today */}
              <div
                className="cursor-pointer hover:bg-[#f4f3ef] w-full px-4 py-2 text-left flex justify-between items-center"
                onClick={selectToday}
              >
                <div>
                  <div className="font-normal text-base">Today</div>
                  <div className="text-xs text-gray-500">{format(today, "MMM d, yyyy")}</div>
                </div>
                {isTodaySelected() && <Check size={18} className="text-black" />}
              </div>

              {/* Yesterday */}
              <div
                className="cursor-pointer hover:bg-[#f4f3ef] w-full px-4 py-2 text-left flex justify-between items-center"
                onClick={selectYesterday}
              >
                <div>
                  <div className="font-normal text-base">Yesterday</div>
                  <div className="text-xs text-gray-500">{format(yesterday, "MMM d, yyyy")}</div>
                </div>
                {isYesterdaySelected() && <Check size={18} className="text-black" />}
              </div>

              {/* This month */}
              <div
                className="cursor-pointer hover:bg-[#f4f3ef] w-full px-4 py-2 text-left flex justify-between items-center"
                onClick={selectThisMonth}
              >
                <div>
                  <div className="font-normal text-base">This month</div>
                  <div className="text-xs text-gray-500">
                    {format(thisMonthStart, "MMM d")} – {format(thisMonthEnd, "MMM d")}
                  </div>
                </div>
                {isThisMonthSelected() && <Check size={18} className="text-black" />}
              </div>

              {/* Last month */}
              <div
                className="cursor-pointer hover:bg-[#f4f3ef] w-full px-4 py-2 text-left flex justify-between items-center"
                onClick={selectLastMonth}
              >
                <div>
                  <div className="font-normal text-base">Last month</div>

                  <div className="text-xs text-gray-500">
                    {format(lastMonthStart, "MMM d")} – {format(lastMonthEnd, "MMM d")}
                  </div>
                </div>
                {isLastMonthSelected() && <Check size={18} className="text-black" />}
              </div>

              {/* Custom range */}
              <div
                className="cursor-pointer flex items-center justify-between hover:bg-[#f4f3ef] w-full px-4 py-2 text-left"
                onClick={() => {
                  setShowCustomRange(true);
                }}
              >
                <div>
                  <div className="font-normal text-sm">Custom range</div>
                  {range?.from && range?.to && (
                    <div className="text-xs text-gray-500">
                      {safeFormat(range?.from, "MMM d")} – {safeFormat(range?.to, "MMM d")}
                    </div>
                  )}
                </div>
                <ArrowRight size={18} className="text-gray-500" />
              </div>
            </div>
          ) : (
            <div className="grow">
              <DateRangePickerInline
                value={range}
                onChange={setRange}
                onBack={() => setShowCustomRange(false)}
              />
            </div>
          )}
          {/* Footer */}
          <div className="border-t border-[#e8e7dd] px-6 py-4 flex justify-end bg-white]">
            <button
              className="text-sm text-[#71725f] hover:underline"
              onClick={() => {
                setRange(undefined);
                setShowCustomRange(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
