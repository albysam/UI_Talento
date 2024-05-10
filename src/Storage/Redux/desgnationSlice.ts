import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    desgnation: [],
  search: "",
};

export const desgnationSlice = createSlice({
  name: "Department",
  initialState: initialState,
  reducers: {
    setDesgnation: (state, action) => {
      state.desgnation = action.payload;
    },
    
  },
});

export const {setDesgnation} = desgnationSlice.actions;
export const desgnationReducer = desgnationSlice.reducer;

