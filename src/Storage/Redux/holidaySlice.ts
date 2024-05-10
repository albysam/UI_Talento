import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  holiday: [],
  search: "",
};

export const holidaySlice = createSlice({
  name: "Holiday",
  initialState: initialState,
  reducers: {
    setHoliday: (state, action) => {
      state.holiday = action.payload;
    },
    
  },
});

export const {setHoliday} = holidaySlice.actions;
export const holidayReducer = holidaySlice.reducer;

