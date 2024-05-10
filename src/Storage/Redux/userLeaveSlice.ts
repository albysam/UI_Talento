import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLeave: [],
  search: "",
};

export const userLeaveSlice = createSlice({
  name: "UserLeave",
  initialState: initialState,
  reducers: {
    setUserLeave: (state, action) => {
      state.userLeave = action.payload;
    },
    
  },
});

export const {setUserLeave} = userLeaveSlice.actions;
export const userLeaveReducer = userLeaveSlice.reducer;

