// src/redux/slices/tripSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DateRange } from "react-day-picker";
import type { Row } from "../../helper/type";

export interface TripState {
  activeTab: number;
  dateRange: DateRange | undefined;
  tripData: Row[];
}

const initialState: TripState = {
  activeTab: 0,
  dateRange: undefined,
  tripData: [],
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange | undefined>) => {
      state.dateRange = action.payload;
    },
    setData: (state, action: PayloadAction<Row[]>) => {
      state.tripData = action.payload;
    },
  },
});

export const { setActiveTab, setDateRange, setData } = tripSlice.actions;
export default tripSlice.reducer;
