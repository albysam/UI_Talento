import React, { useState } from "react";
import {  useGetAttendenceUsersQuery } from "../../Apis/attendenceUserApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { useNavigate } from "react-router";
import { userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import attendenceModel from "../../Interfaces/attendenceModel";

function AttendenceuserList() {
 
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetAttendenceUsersQuery({
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

  
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Attendence Record</h1>
            <div className="col-md-5">
             


              
            
            </div>
          </div>

          {/* Search input */}
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
              <div className="col-2">Employee Name</div>
              <div className="col-2">Email Id</div>
              <div className="col-1">Working Date</div>

              <div className="col-2">clock In Time</div>
              <div className="col-2">Clock OutTime</div>
              <div className="col-2">Worked Hours</div>
             
              
            </div>

            {data &&
              data.result &&
              data.result.length > 0 &&
              data.result
               
                .map((attendence: attendenceModel, index: number) => (
                  <div className="row border" key={attendence.id || index}>
                     <div className="col-1">{index + 1}</div>
                    <div className="col-2">{attendence.name}</div>
                    <div className="col-2">{attendence.userName}</div>
                    <div className="col-1">{new Date(attendence.workingDate).toLocaleDateString()}</div>


                    <div className="col-2">{new Date(attendence.clockInTime).toLocaleTimeString()}</div>
                    <div className="col-2">{new Date(attendence.clockOutTime).toLocaleTimeString()}</div>

                 
                    
                    
                    <div className="col-2">{attendence.workedHours}</div>
                    
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );





}

export default AttendenceuserList;
