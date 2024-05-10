import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendence: [],
  search: "",
};

export const attendenceUserSlice = createSlice({
  name: "AttendenceUser",
  initialState: initialState,
  reducers: {
    setAttendenceUser: (state, action) => {
      state.attendence = action.payload;
    },
    
  },
});

export const {setAttendenceUser} = attendenceUserSlice.actions;
export const attendenceUserReducer = attendenceUserSlice.reducer;

