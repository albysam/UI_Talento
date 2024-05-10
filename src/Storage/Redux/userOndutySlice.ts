import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userOnduty: [],
  search: "",
};

export const userOndutySlice = createSlice({
  name: "UserOnduty",
  initialState: initialState,
  reducers: {
    setUserOnduty: (state, action) => {
      state.userOnduty = action.payload;
    },
    
  },
});

export const {setUserOnduty} = userOndutySlice.actions;
export const userOndutyReducer = userOndutySlice.reducer;

