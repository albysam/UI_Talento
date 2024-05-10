import React, { useState } from "react";
import { useDeleteAttendenceMutation, useGetAttendencesQuery } from "../../Apis/attendenceApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { useNavigate } from "react-router";
import { userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import attendenceModel from "../../Interfaces/attendenceModel";

function AttendenceList() {
  const [deleteAttendence] = useDeleteAttendenceMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetAttendencesQuery({
    searchString,
  });
  const userData: userModel = useSelector((state: RootState) => state.userAuthStore);
  const navigate = useNavigate();

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

  const handleAttendenceDelete = async (id: number) => {
    toast.promise(
      deleteAttendence(id),
      {
        pending: "Processing your request...",
        success: "Department Deleted Successfully 👌",
        error: "Error encountered 🤯",
      },
      {
        theme: "dark",
      }
    );
  };
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const userAttendance1= data?.result?.find((attendence: attendenceModel) => attendence.employeeId === userData.id);
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="p-2">
            {data &&
              data.result &&
              data.result.length > 0 ? ( 
              data.result
                .filter((attendence: attendenceModel) => attendence.employeeId === userData.id) 
                .map((attendence: attendenceModel, index: number) => (
                  <div className="row border" key={attendence.id || index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h1 className="text-success">You are currently working</h1>
                      <div>
                      <p>Clock In Time: {formatTime(attendence.clockInTime)}</p>
          
        </div>
                      <button
                        className="btn btn-success"
                        onClick={() => navigate("/attendence/attendenceupsert/" + attendence.id)}
                      >
                        Manage Clock Out
                      </button>
                    </div>
                  </div>
                ))
              ) :    
             
              
              (
                <div className="d-flex justify-content-between align-items-center">
                <h1 className="text-success">You are currently not working</h1>

                
                <div>
                    
          
        </div>


                <button
                 
                  className="btn btn-success"
                  onClick={() => navigate("/attendence/attendenceUpsert/")}
                >
                  Enable Clock In
                </button>
              </div>
             
            )
            
            }
            <div className="row border">
              <button
                className="btn btn-success"
                onClick={() => navigate("/attendence/attendenceUserList")}
              >
                View Attendance Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
    
}

export default AttendenceList;