import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leave: [],
  search: "",
};

export const resgnationSlice = createSlice({
  name: "Leave",
  initialState: initialState,
  reducers: {
    setLeave: (state, action) => {
      state.leave = action.payload;
    },
    
  },
});

export const {setLeave} = resgnationSlice.actions;
export const resgnationReducer = resgnationSlice.reducer;

