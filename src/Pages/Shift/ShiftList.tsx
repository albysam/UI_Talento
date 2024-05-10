import React, { useState } from "react";
import {
  useDeleteShiftMutation,
  useGetShiftsQuery,
} from "../../Apis/shiftApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { useNavigate } from "react-router";
import shiftModel from "../../Interfaces/shiftModel";

function ShiftList() {
  const [deleteShift] = useDeleteShiftMutation();
  const [searchString, setSearchString] = useState("");
  const extractTimeFromDate = (dateTimeString: string | number | Date) => {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12; 
  
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
  };
  const { data, isLoading } = useGetShiftsQuery({
    searchString,
  });
  
  const navigate = useNavigate();
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  const handleShiftDelete = async (id: number) => {
    toast.promise(
      deleteShift(id),
      {
        pending: "Processing your request...",
        success: "Shift Deleted Successfully 👌",
        error: "Error encountered 🤯",
      },
      {
        theme: "dark",
      }
    );
  };

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading &&  (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Shift List</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/shift/shiftupsert")}
            >
              Add New Shift
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
              <div className="col-1">ID</div>
              <div className="col-2">Shift Name</div>

              <div className="col-1">Start Time</div>
              <div className="col-1">End Time</div>
              <div className="col-2">Shift Duration</div>
              <div className="col-2">Break Duration</div>
              <div className="col-2">Total Shift Duration</div>
              <div className="col-1">Action</div>
            </div>
            
            {data && data.result && data.result.length > 0 && data.result.map((shift: shiftModel) =>{

           return (
              <div className="row border" >
                <div className="col-1">{shift.id}</div>
                <div className="col-2">{shift.shiftName}</div>
                <div className="col-1">{extractTimeFromDate(shift.startTime)}</div>
                <div className="col-1">{extractTimeFromDate(shift.endTime)}</div>
                <div className="col-2">{shift.shiftDuration}</div>
                <div className="col-2">{shift.breakDuration}</div>
                <div className="col-2">{shift.totalShiftDuration}</div>
               
              
                <div className="col-1 d-flex align-items-center justify-content-around">
  <button className="btn btn-success" onClick={() => navigate("/Shift/Shiftupsert/" + shift.id)}>
    <i className="bi bi-pencil-fill"></i>
  </button>
  <button className="btn btn-danger" onClick={() => handleShiftDelete(shift.id)}>
    <i className="bi bi-trash-fill"></i>
  </button>
</div>

              </div>
             );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default ShiftList;