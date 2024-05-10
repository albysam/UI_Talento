import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userShift: [],
  search: "",
};

export const userShiftSlice = createSlice({
  name: "UserShift",
  initialState: initialState,
  reducers: {
    setUserShift: (state, action) => {
      state.userShift = action.payload;
    },
    
  },
});

export const {setUserShift} = userShiftSlice.actions;
export const userShiftReducer = userShiftSlice.reducer;

