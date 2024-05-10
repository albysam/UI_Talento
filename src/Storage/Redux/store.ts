import { configureStore } from "@reduxjs/toolkit";

import { userAuthReducer } from "./userAuthSlice";
import { applicationUserReducer } from "./applicationUserSlice";
import { departmentReducer } from "./departmentSlice";
import { desgnationReducer } from "./desgnationSlice";
import { resgnationReducer } from "./resgnationSlice";

import {
  applicationUserApi,
  departmentApi,
  authApi,
  desgnationApi,
  leaveApi,
 userLeaveApi,
 resgnationApi,
 attendenceApi,
 attendenceUserApi,
 userOndutyApi,
 workingDayApi,
 holidayApi,
} from "../../Apis";
import { leaveReducer } from "./leaveSlice";
import { userLeaveReducer } from "./userLeaveSlice";
import { attendenceReducer } from "./attendenceSlice";
import shiftApi from "../../Apis/shiftApi";
import { shiftReducer } from "./shiftSlice";
import userShiftApi from "../../Apis/userShiftApi";
import { userShiftReducer } from "./userShiftSlice";
import { userOvertimeReducer } from "./userOvertimeSlice";
import userOvertimeApi from "../../Apis/userOvertimeApi";
import { userOndutyReducer } from "./userOndutySlice";
import { workingDayReducer } from "./workingDaySlice";
import { holidayReducer } from "./holidaySlice";



const store = configureStore({
  reducer: {
    
    applicationUserStore: applicationUserReducer,

    departmentStore: departmentReducer,
    desgnationStore: desgnationReducer,
    userAuthStore: userAuthReducer,
    leaveStore: leaveReducer,
    userLeaveStore: userLeaveReducer,
    resgnationStore: resgnationReducer,
    attendenceStore: attendenceReducer,
    shiftStore: shiftReducer,
    userShiftStore: userShiftReducer,
    userOvertimeStore: userOvertimeReducer,
    userOndutyStore: userOndutyReducer,
    workingDayStore: workingDayReducer,
    holidayStore: holidayReducer,
    [applicationUserApi.reducerPath]: applicationUserApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [desgnationApi.reducerPath]: desgnationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [userLeaveApi.reducerPath]: userLeaveApi.reducer,
    [resgnationApi.reducerPath]: resgnationApi.reducer,
    [attendenceApi.reducerPath]: attendenceApi.reducer,
    [attendenceUserApi.reducerPath]: attendenceUserApi.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [userShiftApi.reducerPath]: userShiftApi.reducer,
    [userOvertimeApi.reducerPath]: userOvertimeApi.reducer,
    [userOndutyApi.reducerPath]: userOndutyApi.reducer,
    [workingDayApi.reducerPath]: workingDayApi.reducer,
    [holidayApi.reducerPath]: holidayApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      
      .concat(applicationUserApi.middleware)
      .concat(authApi.middleware)
      .concat(departmentApi.middleware)
      .concat(desgnationApi.middleware)
      .concat(leaveApi.middleware)
      .concat(resgnationApi.middleware)
      .concat(attendenceApi.middleware)
      .concat(attendenceUserApi.middleware)
      .concat(shiftApi.middleware)
      .concat(userShiftApi.middleware)
      .concat(userOvertimeApi.middleware)
      .concat(userOndutyApi.middleware)
      .concat(userLeaveApi.middleware)
      .concat(holidayApi.middleware)
      .concat(workingDayApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;

export default store;
