import React, { useState } from "react";
import {
  useDeleteLeaveMutation,
  useGetLeavesQuery,
} from "../../Apis/leaveApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { leaveModel } from "../../Interfaces";
import { useNavigate } from "react-router";

function LeaveList() {
  const [deleteLeave] = useDeleteLeaveMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetLeavesQuery({
    searchString,
  });
  
  const navigate = useNavigate();
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  const handleLeaveDelete = async (id: number) => {
    toast.promise(
      deleteLeave(id),
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
            <h1 className="text-success">Leave List</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/leave/leaveupsert")}
            >
              Add New Leave
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
              <div className="col-2">Name</div>
              <div className="col-2">Days</div>
              <div className="col-1">Action</div>
            </div>
            
            {data && data.result && data.result.length > 0 && data.result.map((leave: leaveModel) =>{

           return (
              <div className="row border" >
                <div className="col-1">{leave.id}</div>
                <div className="col-2">{leave.leaveName}</div>
                <div className="col-2">{leave.paidLeaveDays}</div>
                <div className="col-1 d-flex align-items-center justify-content-around">
  <button className="btn btn-success" onClick={() => navigate("/leave/leaveupsert/" + leave.id)}>
    <i className="bi bi-pencil-fill"></i>
  </button>
  <button className="btn btn-danger" onClick={() => handleLeaveDelete(leave.id)}>
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

export default LeaveList;