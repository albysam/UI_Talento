import React, { useState, Suspense, lazy } from "react";
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {

  ApplicationUserList,
  ApplicationUsersalaryList,
  ApplicationUsersalaryempList,
  Attendence,
  DepartmentList,
  DesgnationList,
  HolidayList,
  Home,
  Login,
  Register,
  ShiftList,
  UserLeaveList,
  UserOndutyList,
  UserOvertimeList,
  UserShiftList,
  WorkingDayList,
 

} from "../Pages";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { userModel } from "../Interfaces";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { RootState } from "../Storage/Redux/store";
import NotFound from "../Pages/NotFound";
import AccessDenied from "../Pages/AccessDenied";
import AuthenticationTestAdmin from "../Pages/AuthenticationTestAdmin";
import AuthenticationTest from "../Pages/AuthenticationTest";
import ApplicationUserUpsert from "../Pages/ApplicationUser/ApplicationUserUpsert";
import DepartmentUpsert from "../Pages/Department/DepartmentUpsert";
import DesgnationUpsert from "../Pages/Desgnation/DesgnationUpsert";
import ChangePassword from "../Pages/ApplicationUser/ChangePassword";
import LeaveList from "../Pages/Leave/LeaveList";
import LeaveUpsert from "../Pages/Leave/LeaveUpsert";
import UserLeaveUpsert from "../Pages/UserLeave/UserLeaveUpsert";
import ResgnationUpsert from "../Pages/Resgnation/ResgnationUpsert";
import ResgnationList from "../Pages/Resgnation/ResgnationList";
import AttendenceList from "../Pages/Attendence/AttendenceList";
import AttendenceUpsert from "../Pages/Attendence/AttendenceUpsert";
import AttendenceuserList from "../Pages/Attendence/AttendenceuserList";
import AttendenceadminList from "../Pages/Attendence/AttendenceadminList";
import ApplicationUserUpsertAdmin from "../Pages/ApplicationUser/ApplicationUserUpsertAdmin";
import ApplicationUserUpsertAdminEmployee from "../Pages/ApplicationUser/ApplicationUserUpsertAdminEmployee";
import VideoCall from "./VideoCall";
import Appchat from "./Chat/Appchat";
import ShiftUpsert from "../Pages/Shift/ShiftUpsert";
import UserShiftUpsert from "../Pages/UserShift/UserShiftUpsert";
import UserShiftListEmployee from "../Pages/UserShift/UserShiftListEmployee";
import UserShiftUpsertEmployee from "../Pages/UserShift/UserShiftUpsertEmployee";
import AttendenceadminListEmployee from "../Pages/Attendence/AttendenceadminListEmployee";
import UserOvertimeUpsert from "../Pages/UserOvertime/UserOvertimeUpsert";
import AttendenceadminListEmployees from "../Pages/Attendence/AttendenceadminListEmployees";
import UserOndutyUpsert from "../Pages/UserOnduty/UserOndutyUpsert";
import Chatt from "../Pages/Chatt";
import WorkingDayUpsert from "../Pages/WorkingDay/WorkingDayUpsert";
import HolidayUpsert from "../Pages/Holiday/HolidayUpsert";

function App() {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const userData = useSelector((state: RootState) => state.userAuthStore);
 
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role, department }: userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role, department }));
    }
  }, []);

  
  useEffect(() => {
    if (userData.id) setSkip(false);
  }, [userData]);

  return (
    
    <div>
      
      <Header />
      
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/videoCall" element={<VideoCall />} /> 
          <Route path="/chat" element={<Appchat />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/attendence/attendencelist" element={<AttendenceList />} />
          <Route path="/attendence/attendenceuserlist" element={<AttendenceuserList />} />
          <Route path="/attendence/attendenceadminlist" element={<AttendenceadminList />} />
          <Route path="/attendence/attendenceadminlistemployee/:userId" element={<AttendenceadminListEmployee />} />
          <Route path="/attendence/attendenceadminlistemployees/:userId" element={<AttendenceadminListEmployees />} />
          <Route path="/attendence/attendence" element={<Attendence />} />
          <Route
            path="/attendence/attendence/:id"
            element={<Attendence />}
          />
          <Route
            path="/attendence/attendenceUpsert/:id"
            element={<AttendenceUpsert />}
          />
          <Route path="/attendence/attendenceUpsert" element={<AttendenceUpsert />} />
          <Route path="/applicationUser/changepassword" element={<ChangePassword />} />
          <Route
            path="/applicationUser/changepassword/:id"
            element={<ChangePassword />}
          />
          <Route path="/applicationUser/applicationusersalarylist" element={<ApplicationUsersalaryList />} />
          <Route path="/applicationUser/applicationusersalaryemplist" element={<ApplicationUsersalaryempList />} />    

          <Route path="/applicationUser/applicationuserlist" element={<ApplicationUserList />} />
          <Route
            path="/applicationUser/applicationUserUpsert/:id"
            element={<ApplicationUserUpsert />}
          />
          <Route path="/applicationUser/applicationUserUpsert" element={<ApplicationUserUpsert />} />
          <Route path="/department/departmentlist" element={<DepartmentList />} />
          <Route
            path="/applicationUser/applicationUserUpsertAdmin/:id"
            element={<ApplicationUserUpsertAdmin />}
          />
          <Route path="/applicationUser/applicationUserUpsertAdmin" element={<ApplicationUserUpsertAdmin />} />
          <Route
            path="/applicationUser/applicationUserUpsertAdminEmployee/:id"
            element={<ApplicationUserUpsertAdminEmployee />}
          />
          <Route path="/applicationUser/applicationUserUpsertAdminEmployee" element={<ApplicationUserUpsertAdminEmployee />} />
          <Route
            path="/department/departmentUpsert/:id"
            element={<DepartmentUpsert />}
          />
          <Route path="/department/departmentUpsert" element={<DepartmentUpsert />} />
          <Route path="/leave/leavelist" element={<LeaveList />} />
          <Route
            path="/leave/leaveUpsert/:id"
            element={<LeaveUpsert />}
          />
          <Route path="/leave/leaveUpsert" element={<LeaveUpsert />} />
          <Route path="/shift/shiftList" element={<ShiftList />} />
          <Route
            path="/shift/shiftUpsert/:id"
            element={<ShiftUpsert />}
          />
          <Route path="/shift/shiftUpsert" element={<ShiftUpsert />} />

          <Route path="/userShift/userShiftlist" element={<UserShiftList />} />
          <Route
            path="/userShift/userShiftUpsert/:id"
            element={<UserShiftUpsert />}
          />
          <Route path="/userShift/userShiftUpsert" element={<UserShiftUpsert />} />
          <Route path="/userShift/UserShiftListemployee/:userId" element={<UserShiftListEmployee />} />

          <Route
            path="/userShift/userShiftUpsertemployee/:id"
            element={<UserShiftUpsertEmployee />}
          />
          <Route path="/userShift/userShiftUpsertemployee" element={<UserShiftUpsertEmployee />} />


          <Route path="/userLeave/userLeavelist" element={<UserLeaveList />} />
          <Route
            path="/userLeave/userLeaveUpsert/:id"
            element={<UserLeaveUpsert />}
          />
          <Route path="/userLeave/userLeaveUpsert" element={<UserLeaveUpsert />} />

          <Route path="/Chatt" element= {<Chatt/>}> </Route>


          <Route path="/userOvertime/userOvertimelist" element={<UserOvertimeList />} />
          <Route
            path="/userOvertime/userOvertimeUpsert/:id"
            element={<UserOvertimeUpsert />}
          />
          <Route path="/userOvertime/userOvertimeUpsert" element={<UserOvertimeUpsert />} />


          <Route path="/userOnduty/userOndutylist" element={<UserOndutyList />} />
          <Route
            path="/userOnduty/userOndutyUpsert/:id"
            element={<UserOndutyUpsert />}
          />
          <Route path="/userOnduty/userOndutyUpsert" element={<UserOndutyUpsert />} />
          <Route path="/resgnation/resgnationlist" element={<ResgnationList />} />
          <Route
            path="/resgnation/resgnationUpsert/:id"
            element={<ResgnationUpsert />}
          />
          <Route path="/resgnation/resgnationUpsert" element={<ResgnationUpsert />} />
          <Route path="/desgnation/desgnationlist" element={<DesgnationList />} />
          <Route
            path="/desgnation/desgnationUpsert/:id"
            element={<DesgnationUpsert />}
          />
          <Route path="/desgnation/desgnationUpsert" element={<DesgnationUpsert />} />
          <Route path="/workingDay/workingDaylist" element={<WorkingDayList />} />
          <Route
            path="/workingDay/workingDayUpsert/:id"
            element={<WorkingDayUpsert />}
          />
          <Route path="/workingDay/workingDayUpsert" element={<WorkingDayUpsert />} />

          <Route path="/holiday/holidaylist" element={<HolidayList />} />
          <Route
            path="/holiday/holidayUpsert/:id"
            element={<HolidayUpsert />}
          />
          <Route path="/holiday/holidayUpsert" element={<HolidayUpsert />} />
          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>

          <Route path="/accessDenied" element={<AccessDenied />} />
        
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

