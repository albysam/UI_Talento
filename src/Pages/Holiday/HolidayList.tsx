import React, { useState } from "react";
import {
  useDeleteHolidayMutation,
  useGetHolidaysQuery,
} from "../../Apis/holidayApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { holidayModel } from "../../Interfaces";
import { useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css'; 
function HolidayList() {
  const [deleteHoliday] = useDeleteHolidayMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetHolidaysQuery({
    searchString,
  });
 
  const navigate = useNavigate();
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  const handleHolidayDelete = async (id: number) => {
    toast.promise(
      deleteHoliday(id),
      {
        pending: "Processing your request...",
        success: "Holiday Deleted Successfully 👌",
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
            <h1 className="text-success">Holiday List</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/holiday/holidayupsert")}
            >
              Add New Holiday
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
              <div className="col-2">Holiday Name</div>
              <div className="col-2">Date</div>
              <div className="col-1">Action</div>
            </div>
            
            {data && data.result && data.result.length > 0 && data.result.map((holiday: holidayModel) =>{

           return (
              <div className="row border" >
                <div className="col-1">{holiday.id}</div>
                <div className="col-2">{holiday.holidayName}</div>
                <div className="col-2">
                      {holiday.date.substring(0, 10)}
                    </div>
                <div className="col-1 d-flex align-items-center justify-content-around">
  <button className="btn btn-success" onClick={() => navigate("/holiday/holidayupsert/" + holiday.id)}>
    <i className="bi bi-pencil-fill"></i>
  </button>
  <button className="btn btn-danger" onClick={() => handleHolidayDelete(holiday.id)}>
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

export default HolidayList;