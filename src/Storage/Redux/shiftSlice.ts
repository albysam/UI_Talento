import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shift: [],
  search: "",
};

export const shiftSlice = createSlice({
  name: "Shift",
  initialState: initialState,
  reducers: {
    setShift: (state, action) => {
      state.shift = action.payload;
    },
    
  },
});

export const {setShift} = shiftSlice.actions;
export const shiftReducer = shiftSlice.reducer;

