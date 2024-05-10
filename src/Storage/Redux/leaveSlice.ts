import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leave: [],
  search: "",
};

export const leaveSlice = createSlice({
  name: "Leave",
  initialState: initialState,
  reducers: {
    setLeave: (state, action) => {
      state.leave = action.payload;
    },
    
  },
});

export const {setLeave} = leaveSlice.actions;
export const leaveReducer = leaveSlice.reducer;

