import React, { useState } from "react";
import {
  useDeleteUserLeaveMutation,
  useGetUserLeavesQuery,
} from "../../Apis/userLeaveApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { userLeaveModel } from "../../Interfaces";
import { useNavigate } from "react-router";
import { SD_Roles } from "../../Utility/SD";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";

function UserLeaveList() {
  const [deleteUserLeave] = useDeleteUserLeaveMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetUserLeavesQuery({
    searchString,
  });

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

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const handleUserLeaveDelete = async (id: number) => {
    toast.promise(
      deleteUserLeave(id),
      {
        pending: "Processing your request...",
        success: "Leave Deleted Successfully 👌",
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
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Applied Leave List</h1>
            {userData.role !== SD_Roles.SuperAdmin && (
              <button
                className="btn btn-success"
                onClick={() => navigate("/userLeave/userLeaveupsert")}
              >
                Apply Leave
              </button>
            )}
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
              <div className="col-1">User Name</div>
              <div className="col-2">Email Id</div>
              <div className="col-1">Leave Applied</div>
              <div className="col-1">Leave Type</div>
              <div className="col-1">No of Days</div>
              <div className="col-1">Date From</div>
              <div className="col-1">Date To</div>
              <div className="col-1">Status</div>
              <div className="col-2">Action</div>
            </div>

            {data &&
              data.result &&
              data.result.length > 0 &&
              data.result
                .filter((userLeave: userLeaveModel) =>
                  userData.role === SD_Roles.SuperAdmin
                    ? true
                    : userLeave.userId === userData.id
                )
                .map((userLeave: userLeaveModel, index: number) => (
                  <div className="row border" key={index}>
                 <div className="col-1">{index + 1}</div> 
                    <div className="col-1">{userLeave.name}</div>
                    <div className="col-2">{userLeave.userName}</div>
                    <div className="col-1">{userLeave.leaveName}</div>
                    <div className="col-1">{userLeave.type}</div>
                    <div className="col-1">{userLeave.leaveDays}</div>
                    <div className="col-1">
                      {userLeave.dateFrom.substring(0, 10)}
                    </div>
                    <div className="col-1">
                      {userLeave.dateTo.substring(0, 10)}
                    </div>
                    <div className="col-1">
                      {getStatusText(userLeave.status)}
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-around">
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate(
                            "/userLeave/userLeaveupsert/" + userLeave.id
                          )
                        }
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      {(userData.role === SD_Roles.SuperAdmin ) && (  


                      <button
                        className="btn btn-danger"
                        onClick={() => handleUserLeaveDelete(userLeave.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
)}


                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UserLeaveList;
