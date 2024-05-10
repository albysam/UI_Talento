import React, { useEffect, useState } from "react";
import { MainLoader } from '../../Components/Page/Common';
import { useCreateAttendenceMutation, useGetAttendenceByIdQuery } from "../../Apis/attendenceApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { applicationUserModel, userModel } from "../../Interfaces";
import { inputHelper, toastNotify } from "../../Helper";

const initialAttendenceData = {
  employeeId: "", 
  user: "",
  clockInTime: new Date(),
  clockOutTime: new Date(),
  breakStartTime: new Date(),
  breakEndTime: new Date(),
  workingDate: new Date(),
  workedHours: "",
  breakHours: "",
  status: 0
};

function Attendence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendenceInputs, setAttendenceInputs] = useState(initialAttendenceData);
  const [loading, setLoading] = useState(false);
  const [createAttendence] = useCreateAttendenceMutation();
  const [clockIn, setClockIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const { data } = useGetAttendenceByIdQuery(id);
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

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

  useEffect(() => {
    if (loggedInUser) {
      setAttendenceInputs(prevInputs => ({
        ...prevInputs,
        employeeId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);

  const handleBreak = () => {
    setOnBreak(true);
  };

  const handleResume = () => {
    setOnBreak(false);
  };

  const handleClockOut = () => {
    navigate("/");
  };

  const handleAttendenceInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const tempData = inputHelper(e, attendenceInputs);
    setAttendenceInputs(tempData);
  };

  const handleSubmit = async () => {
    setLoading(true);
  
    const formData = new FormData();
    formData.append("employeeId", attendenceInputs.employeeId);
    formData.append("clockInTime", attendenceInputs.clockInTime.toISOString());
    formData.append("clockOutTime", attendenceInputs.clockOutTime.toISOString());
    formData.append("breakStartTime", attendenceInputs.breakStartTime.toISOString());
    formData.append("breakEndTime", attendenceInputs.breakEndTime.toISOString());
    formData.append("workingDate", attendenceInputs.workingDate.toISOString());
    formData.append("workedHours", attendenceInputs.workedHours);
    formData.append("breakHours", attendenceInputs.breakHours);
    formData.append("status", attendenceInputs.status.toString());
  
    let response;
    if (id) {
      response = await createAttendence(formData);
      toastNotify("Clock In successfully", "success");
    }
  
    setLoading(false);
  };
  

  const handleClockIn = async () => {
    setClockIn(true); 
    await handleSubmit(); 
  };
  
  
  
  return (
    <>
      <div className="container border mt-5 p-5 bg-light">
        {loading && <MainLoader />}
        <h3 className="px-2 text-success">Attendance</h3>
        <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                name="employeeId"
                value={attendenceInputs.employeeId} 
                onChange={handleAttendenceInput}
              />
              <input
                type="text"
                className="form-control"
                name="clockInTime"
                value={attendenceInputs.clockInTime.toISOString()} 
                onChange={handleAttendenceInput}
              />
              <input
                type="text"
                className="form-control"
                name="workingDate"
                value={attendenceInputs.workingDate.toISOString()} 
                onChange={handleAttendenceInput}
              />
            </div>
            <div className="col-md-5">
              {!clockIn && (
                <button
                  className="btn btn-primary form-control mb-2"
                  onClick={handleClockIn}
                >
                  Clock In
                </button>
              )}
              {clockIn && !onBreak && (
                <button
                  className="btn btn-warning form-control mb-2"
                  onClick={handleBreak}
                >
                  Take Break
                </button>
              )}
              {onBreak && (
                <button
                  className="btn btn-info form-control mb-2"
                  onClick={handleResume}
                >
                  Resume
                </button>
              )}
              {clockIn && (
                <button
                  className="btn btn-danger form-control"
                  onClick={handleClockOut}
                >
                  Clock Out
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Attendence;
