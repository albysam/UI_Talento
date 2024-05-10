import React, { useState } from "react";
import {
  useDeleteUserShiftMutation,
  useGetUserShiftsQuery,
} from "../../Apis/userShiftApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { userShiftModel } from "../../Interfaces";
import { useNavigate } from "react-router";
import { SD_Roles } from "../../Utility/SD";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function UserShiftListEmployee() {
  const { userId } = useParams(); 
  const [deleteUserShift] = useDeleteUserShiftMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetUserShiftsQuery({
    searchString,
  });

 

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const handleUserShiftDelete = async (id: number) => {
    toast.promise(
      deleteUserShift(id),
      {
        pending: "Processing your request...",
        success: "Deleted Successfully 👌",
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
            <h1 className="text-success">Shift List</h1>
            {userData.role !== SD_Roles.ADMIN && userData.role !== SD_Roles.Employee &&(
              <button
                className="btn btn-success"
                onClick={() => navigate(`/userShift/userShiftUpsertemployee/${userId}`)}
              >
                Add Shift
              </button>
            )}
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
            <div className="col-1">Date Added</div>
              <div className="col-1">Name</div>
              <div className="col-2">Email Id</div>
             
              <div className="col-1">Shift Type</div>
             
              <div className="col-1">Date From</div>
              <div className="col-1">Date To</div>
              <div className="col-3">Comment</div>
              <div className="col-1">Action</div>
            </div>

            {data &&
  data.result &&
  data.result.length > 0 &&
  data.result
    .filter((userShift: userShiftModel) => userShift.userId === userId) 
    .map((userShift: userShiftModel, index: number) =>(
                  <div className="row border" key={index}>
                 <div className="col-1">{index + 1}</div> 
                 <div className="col-1">{userShift.date ? userShift.date.split('T')[0] : ''}</div>
                 <div className="col-1">{userShift.name}</div>
                    <div className="col-2">{userShift.userName}</div>

                    <div className="col-1">{userShift.shiftName}</div>

                    <div className="col-1">{userShift.shiftDateFrom ? userShift.shiftDateFrom.split('T')[0] : ''}</div>
<div className="col-1">{userShift.shiftDateTo ? userShift.shiftDateTo.split('T')[0] : ''}</div>

<div className="col-3">{userShift.comment}</div>

                    <div className="col-1 d-flex align-items-center justify-content-around">
                     
                      <button
                        className="btn btn-danger"
                        onClick={() => handleUserShiftDelete(userShift.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UserShiftListEmployee;
