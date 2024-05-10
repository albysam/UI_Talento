import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendence: [],
  search: "",
};

export const attendenceSlice = createSlice({
  name: "Attendence",
  initialState: initialState,
  reducers: {
    setAttendence: (state, action) => {
      state.attendence = action.payload;
    },
    
  },
});

export const {setAttendence} = attendenceSlice.actions;
export const attendenceReducer = attendenceSlice.reducer;

