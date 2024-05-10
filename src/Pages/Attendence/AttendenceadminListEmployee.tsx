import React, { useState } from "react";
import { useGetAggregatedAttendencesQuery } from "../../Apis/attendenceUserApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { useNavigate } from "react-router";
import { userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import attendenceModel from "../../Interfaces/attendenceModel";
import { useParams } from "react-router-dom";

function AttendenceuserListEmployee() {
  const { userId} = useParams(); 

  const [searchString, setSearchString] = useState("");
  const { data, isLoading, isError } = useGetAggregatedAttendencesQuery({
    searchString,
  });
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);
  const navigate = useNavigate();
  const [serialNumber, setSerialNumber] = useState(1); 

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Not Approved";
      default:
        return "Unknown";
    }
  };

  if (isError) {
    toast.error("Error fetching attendance records");
  }


  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && !isError && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
          <h1 className="text-success">Attendance Record: {data && data.result && data.result.length > 0 ? data.result.find((attendence: attendenceModel) => attendence.employeeId === userId)?.name : 'Employee Name Not Found'}</h1>


          <button
                className="btn btn-success"
                onClick={() => navigate( `/attendence/attendenceadminlistemployees/${userId}`)}
              >
                View Complete Attendence
              </button>
          
  
 
          </div>

        
          <div className="p-2">
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>

          <div className="p-2">
            <div className="row border">
              <div className="col-1">SL.No</div> 
              <div className="col-1">Working Date</div>
            
              <div className="col-1">Shift</div>
              <div className="col-2">Worked Hours</div> 
            
            </div>

            {data &&
              data.result &&
              data.result.length > 0 &&
              data.result
    .filter((attendence: attendenceModel) => attendence.employeeId === userId) 
    .map((attendence: attendenceModel, index: number) => (

                <div className="row border" key={attendence.id || index}>
                  <div className="col-1">{index + 1}</div> 
                  <div className="col-1">{new Date(attendence.workingDate).toLocaleDateString()}</div>
                 
                  <div className="col-1">{attendence.shiftName}</div>
                  <div className="col-2">
                    {Math.floor(attendence.totalWorkedHours)} hours {attendence.totalWorkedMinutes} minutes
                  </div> 
                  

                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default AttendenceuserListEmployee;
