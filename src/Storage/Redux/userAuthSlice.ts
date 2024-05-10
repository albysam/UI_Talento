import { createSlice } from "@reduxjs/toolkit";
import { userModel } from "../../Interfaces";

export const emptyUserState: userModel = {
  fullName: "",
  id: "",
  email: "",
  role: "",
  department: "",
  status: 0,
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: emptyUserState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.fullName = action.payload.fullName;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
     state.department = action.payload.department; 
     state.status = action.payload.status; 
    },
  },
});

export const { setLoggedInUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
