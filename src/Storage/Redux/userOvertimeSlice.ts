import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userOvertime: [],
  search: "",
};

export const userOvertimeSlice = createSlice({
  name: "UserOvertime",
  initialState: initialState,
  reducers: {
    setUserOvertime: (state, action) => {
      state.userOvertime = action.payload;
    },
    
  },
});

export const {setUserOvertime} = userOvertimeSlice.actions;
export const userOvertimeReducer = userOvertimeSlice.reducer;

