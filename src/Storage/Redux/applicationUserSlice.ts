import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applicationUser: [],
  search: "",
};

export const applicationUserSlice = createSlice({
  name: "ApplicationUser",
  initialState: initialState,
  reducers: {
    setApplicationUser: (state, action) => {
      state.applicationUser = action.payload;
    },
    
  },
});


export const applicationUserReducer = applicationUserSlice.reducer;
