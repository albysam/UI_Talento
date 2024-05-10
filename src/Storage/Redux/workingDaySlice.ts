import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workingDay: [],
  search: "",
};

export const workingDaySlice = createSlice({
  name: "WorkingDay",
  initialState: initialState,
  reducers: {
    setWorkingDay: (state, action) => {
      state.workingDay = action.payload;
    },
    
  },
});

export const {setWorkingDay} = workingDaySlice.actions;
export const workingDayReducer = workingDaySlice.reducer;

