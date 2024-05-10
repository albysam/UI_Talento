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
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}
function UserShiftList() {
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
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Shift List</h1>
           
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
            {userData.role === SD_Roles.SuperAdmin && (
                <>
                  <div className="col-1">Date Added</div>
                  <div className="col-2">User Name</div>
                  <div className="col-2">Email Id</div>
                </>
              )}
              <div className="col-2">Shift Type</div>
             
              <div className="col-2">Date From</div>
              <div className="col-2">Date To</div>
            
            </div>

            {data &&
              data.result &&
              data.result.length > 0 &&
              data.result
                .filter((userShift: userShiftModel) =>
                  userData.role === SD_Roles.SuperAdmin
                    ? true
                    : userShift.userId === userData.id
                )
                .map((userShift: userShiftModel, index: number) => (
                  <div className="row border" key={index}>
                 <div className="col-1">{index + 1}</div> 
                 {userData.role === SD_Roles.SuperAdmin && (
                      <>
                        <div className="col-1">{formatDate(userShift.date)}</div>
                        <div className="col-2">{userShift.name}</div>
                        <div className="col-2">{userShift.userName}</div>
                      </>
                    )}

                    <div className="col-2">{userShift.shiftName}</div>

                    <div className="col-2">{formatDate(userShift.shiftDateFrom)}</div>
<div className="col-2">{formatDate(userShift.shiftDateTo)}</div>


                    <div className="col-1 d-flex align-items-center justify-content-around">
                      
                     
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UserShiftList;
