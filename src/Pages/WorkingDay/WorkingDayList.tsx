import React, { useState } from "react";
import {
  useDeleteWorkingDayMutation,
  useGetWorkingDaysQuery,
} from "../../Apis/workingDayApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { workingDayModel } from "../../Interfaces";
import { useNavigate } from "react-router";

function WorkingDayList() {
  const [deleteWorkingDay] = useDeleteWorkingDayMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetWorkingDaysQuery({
    searchString,
  });
  
  const navigate = useNavigate();
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  const handleWorkingDayDelete = async (id: number) => {
    toast.promise(
      deleteWorkingDay(id),
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

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading &&  (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Working Day</h1>
           
          </div>



          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-2">Days</div>
              <div className="col-1">Action</div>
            </div>
            
            {data && data.result && data.result.length > 0 && data.result.map((workingDay: workingDayModel) =>{

           return (
              <div className="row border" >
                <div className="col-1">{workingDay.id}</div>
                <div className="col-2">{workingDay.workingDays}</div>
                <div className="col-1 d-flex align-items-center justify-content-around">
  <button className="btn btn-success" onClick={() => navigate("/workingDay/workingDayupsert/" + workingDay.id)}>
    <i className="bi bi-pencil-fill"></i>
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

export default WorkingDayList;