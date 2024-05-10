import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  department: [],
  search: "",
};

export const departmentSlice = createSlice({
  name: "Department",
  initialState: initialState,
  reducers: {
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    
  },
});

export const {setDepartment} = departmentSlice.actions;
export const departmentReducer = departmentSlice.reducer;

