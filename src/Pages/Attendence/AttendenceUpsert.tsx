import React, { useEffect, useState } from "react";
import {
  useCreateAttendenceMutation,
  useGetAttendenceByIdQuery,
  useUpdateAttendenceMutation,
} from "../../Apis/attendenceApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { applicationUserModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";

import { userModel } from "../../Interfaces";
const initialAttendenceData = {
  employeeId: "",
  user: "",

  clockInTime: "",
  clockOutTime: "",
  breakStartTime: "",
  breakEndTime: "",
  workingDate: "",
  workedHours: "",
  breakHours: "",
  status: 0
};

function AttendenceUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendenceInputs, setAttendenceInputs] = useState(initialAttendenceData);
  const [loading, setLoading] = useState(false);
  const [createAttendence] = useCreateAttendenceMutation();
  const [updateAttendence] = useUpdateAttendenceMutation();
  const { data } = useGetAttendenceByIdQuery(id);
  const [clockIn, setClockIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  useEffect(() => {
    if (loggedInUser) {
      setAttendenceInputs(prevInputs => ({
        ...prevInputs,
        employeeId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        employeeId: data.result.employeeId,
        user: data.result.user,

        clockInTime: data.result.clockInTime,
        clockOutTime: data.result.clockOutTime,
        breakStartTime: data.result.breakStartTime,
        breakEndTime: data.result.breakEndTime,
        workingDate: data.result.workingDate,
        workedHours: data.result.workedHours,
        breakHours: data.result.breakHours,
        status: data.result.status,
      };
      setAttendenceInputs(tempData);
    }
  }, [data]);

  const handleAttendenceInput = (
    e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const tempData = inputHelper(e, attendenceInputs);
    setAttendenceInputs(tempData);
  };
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; 
  };
  
  const handleClockIn = () => {
    const currentDate = new Date(); 
    const formattedDate = formatDate(currentDate);
    
    setAttendenceInputs({
      ...attendenceInputs,
      clockInTime: currentDate.toISOString().slice(0, 16), 
      workingDate: formattedDate,
    });
  };
  const handleBreak = () => {
    setOnBreak(true);
  };

  const handleResume = () => {
    setOnBreak(false);
  };
  const handleClockOut = () => {
    const currentDate = new Date().toISOString().slice(0, 16); 
    setAttendenceInputs({
      ...attendenceInputs,
      clockOutTime: currentDate,
    });
    
  };
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("employeeId", attendenceInputs.employeeId);
    formData.append("user", attendenceInputs.user);

    formData.append("clockInTime", attendenceInputs.clockInTime);
    formData.append("clockOutTime", attendenceInputs.clockOutTime);

    formData.append("breakStartTime", attendenceInputs.breakStartTime);
    formData.append("breakEndTime", attendenceInputs.breakEndTime);
    formData.append("workingDate", attendenceInputs.workingDate);

    formData.append("workedHours", attendenceInputs.workedHours);
    formData.append("breakHours", attendenceInputs.breakHours);
    formData.append("status", attendenceInputs.status.toString());
    let response;
 
    if (id) {
      // update
      formData.append("Id", id);
      response = await updateAttendence({ data: formData, id });
      toastNotify("Clock Out successfully", "success");
    } else {
      // create
      response = await createAttendence(formData);
      toastNotify("Clock In successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/Attendence/Attendencelist");
    }
   
    setLoading(false);
  };
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "" : ""}
      </h3>
      
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
         
            <input
              type="text"
              className="form-control"
            hidden
              name="employeeId"
              value={attendenceInputs.employeeId}
              onChange={handleAttendenceInput}
            />
           
            <input
              type="text"
              className="form-control"
            hidden
              name="clockInTime"
              value={attendenceInputs.clockInTime}
              onChange={handleAttendenceInput}
            />
  

            <input
              type="text"
              className="form-control"
             hidden
              name="workingDate"
              value={attendenceInputs.workingDate}
              onChange={handleAttendenceInput}
            />


            <input
              type="text"
              className="form-control"
             hidden
              name="clockOutTime"
              value={attendenceInputs.clockOutTime}
              onChange={handleAttendenceInput}
            />



          </div>
          <div className="col-md-5">
          {!id && (
            <button
              className="btn btn-primary form-control mb-2"
              onClick={handleClockIn}
            >
              Clock In
            </button>

)}
{id && (
            <button
              className="btn btn-danger form-control mb-2"
              onClick={handleClockOut}
            >
              Clock Out
            </button>
)}
{id && (
            <button
            hidden
              className="btn btn-warning form-control mb-2"
              onClick={handleBreak}
            >
              Take Break
            </button>
            )}
            {id && (
            <button
            hidden
              className="btn btn-info form-control mb-2"
              onClick={handleResume}
            >
              Resume
            </button>
             )}
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button
              type="submit"
            hidden
              className="btn btn-success form-control mt-3"
            >
              {id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AttendenceUpsert;
