"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Calendar } from "../components/ui/calendar";
import { PopoverRoot, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { CalendarIcon } from "lucide-react";

export function DateRangePicker() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const display = React.useMemo(() => {
    if (!range?.from) return "Select dates";
    if (!range.to) return format(range.from, "LLL dd");
    return `${format(range.from, "LLL dd")} - ${format(range.to, "LLL dd")}`;
  }, [range]);

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {display}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={setRange}
          initialFocus
        />
      </PopoverContent>
    </PopoverRoot>
  );
}
