import { useState, useRef, useEffect, useMemo } from "react";
import { CalendarRange, ChevronRight, Check } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import type { DateRange } from "react-day-picker";
import { DateRangePickerInline } from "./DateRangePickerInline";
import {
  setGlobalFilterOn,
  setFilteredTrips,
  setGlobalCustomRange,
} from "../redux/slices/tripSlice";
import { getLastNMonthsRange, formatDateRange } from "../helper/functions";

const CustomSelectTag = () => {
  const dispatch = useDispatch();
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("All");
  const { tripData, globalCustomRange } = useSelector((state: RootState) => state.trip);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(globalCustomRange);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState<{ left?: number; right?: number }>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const calendarWidth = 500;

  const options = [
    { label: "Last 3 months", subtitle: getLastNMonthsRange(3) },
    { label: "Last 6 months", subtitle: getLastNMonthsRange(6) },
    { label: "1 year", subtitle: getLastNMonthsRange(12) },
    { label: "Custom range" },
  ];

  const handleSelect = (label: string) => {
    setSelectedDate(label);
    if (label === "Custom range") {
      setShowCalendar(true);
    } else {
      setDateOpen(false);
      setShowCalendar(false);
    }
  };

  const handleReset = () => {
    setSelectedDate("All");
    setCustomRange(undefined);
    setGlobalCustomRange(undefined);
    setDateOpen(false);
    setShowCalendar(false);
    dispatch(setFilteredTrips([]));
    dispatch(setGlobalFilterOn(false));
  };

  const handleBackFromCalendar = () => {
    setShowCalendar(false);
  };

  const activeDateRange = useMemo(() => {
    const now = new Date();

    switch (selectedDate) {
      case "Last 3 months":
        return {
          from: new Date(now.getFullYear(), now.getMonth() - 3, 1),
          to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        };
      case "Last 6 months":
        return {
          from: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        };
      case "1 year":
        return {
          from: new Date(now.getFullYear() - 1, now.getMonth() + 1, 1),
          to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        };
      case "Custom range":
        return customRange;
      default:
        return undefined;
    }
  }, [selectedDate, customRange]);

  const filterTrips = (activeDateRange: DateRange | undefined) => {
    if (!activeDateRange?.from || !activeDateRange?.to) return []; // No date range selected, return empty array

    // Filter trips based on the selected date range
    return tripData.filter(trip => {
      const tripStart = new Date(trip.start);
      const tripEnd = new Date(trip.end);

      // Check if the trip is within the selected date range
      return tripEnd >= activeDateRange.from! && tripStart <= activeDateRange.to!;
    });
  };

  useEffect(() => {
    if (activeDateRange) {
      const filteredTrips = filterTrips(activeDateRange);
      dispatch(setFilteredTrips(filteredTrips)); // Dispatch filtered trips to Redux
      dispatch(setGlobalFilterOn(true));
      dispatch(setGlobalCustomRange(customRange));
    }
  }, [activeDateRange, dispatch, customRange]);

  useEffect(() => {
    dispatch(setGlobalCustomRange(globalCustomRange));
  }, [dispatch, globalCustomRange]);

  // Dynamically calculate calendar position
  useEffect(() => {
    if (showCalendar && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const updatePosition = () => {
        if (rect.left + calendarWidth > viewportWidth) {
          // Overflowing right, position from right
          setCalendarPosition({ right: 0, left: undefined });
        } else {
          // Fits, position from left
          setCalendarPosition({ left: rect.left, right: undefined });
        }
      };

      // Schedule the state update asynchronously
      const id = requestAnimationFrame(updatePosition);

      // Cleanup
      return () => cancelAnimationFrame(id);
    }
  }, [showCalendar, calendarWidth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDateOpen(false);
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-80 relative" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setDateOpen(!dateOpen)}
        className="flex items-center gap-2 border border-gray-300 px-4 py-2 bg-white w-full hover:bg-gray-50 rounded"
      >
        <CalendarRange size={16} />
        <span className="text-sm font-medium">
          {selectedDate === "Custom range" && customRange?.from && customRange?.to
            ? formatDateRange(customRange)
            : selectedDate}
        </span>
        <div className="ml-auto">
          <ChevronRight
            size={16}
            className={`transform transition-transform ${dateOpen ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown menu */}
      {dateOpen && !showCalendar && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-50">
          <ul>
            {options.map(({ label, subtitle }) => (
              <li
                key={label}
                onClick={() => handleSelect(label)}
                className={`cursor-pointer px-4 py-3 hover:bg-gray-100 ${
                  selectedDate === label ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm text-left">{label}</p>

                    {/* Show subtitle for predefined options */}
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}

                    {/* Show selected range for custom range */}
                    {label === "Custom range" && customRange?.from && customRange?.to && (
                      <p className="text-xs text-gray-500">{formatDateRange(customRange)}</p>
                    )}
                  </div>

                  {selectedDate === label && <Check size={16} />}
                  {label === "Custom range" && <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 px-4 py-2 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Calendar overlay */}
      {showCalendar && (
        <div
          className="absolute top-0 bg-white border border-gray-300 rounded shadow-md z-50"
          style={{
            width: `${calendarWidth}px`,
            top: "42px",
            ...calendarPosition,
          }}
        >
          <DateRangePickerInline
            value={customRange}
            onChange={setCustomRange}
            onBack={handleBackFromCalendar}
          />

          {/* Reset button under calendar */}
          <div className="border-t border-gray-200 px-4 py-2 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelectTag;
