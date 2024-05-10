import React, { useState } from "react";
import {
  useDeleteUserOndutyMutation,
  useGetUserOndutysQuery,
} from "../../Apis/userOndutyApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { userOndutyModel } from "../../Interfaces";
import { useNavigate } from "react-router";
import { SD_Roles } from "../../Utility/SD";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";

function UserOndutyList() {
  const [deleteUserOnduty] = useDeleteUserOndutyMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetUserOndutysQuery({
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
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  const extractTimeFromDate = (dateTimeString: string | number | Date) => {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12; 
  
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;
  };
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const handleUserOndutyDelete = async (id: number) => {
    toast.promise(
      deleteUserOnduty(id),
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
            <h1 className="text-success">Applied Onduty List</h1>
            {userData.role !== SD_Roles.SuperAdmin && (
              <button
                className="btn btn-success"
                onClick={() => navigate("/userOnduty/userOndutyupsert")}
              >
                Apply Onduty
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
            
              <div className="col-1">Onduty Date</div>
              <div className="col-1">Time From</div>
             
              <div className="col-1">Time To</div>
              
              <div className="col-1">Status</div>
              <div className="col-2">Action</div>
            </div>

            {data &&
              data.result &&
              data.result.length > 0 &&
              data.result
                .filter((userOnduty: userOndutyModel) =>
                  userData.role === SD_Roles.SuperAdmin
                    ? true
                    : userOnduty.userId === userData.id
                )
                .map((userOnduty: userOndutyModel, index: number) => (
                  <div className="row border" key={index}>
                 <div className="col-1">{index + 1}</div> 
                



                    <div className="col-1">{userOnduty.user.name}</div>
                    <div className="col-2">{userOnduty.user.userName}</div>
                 
                    <div className="col-1">{formatDate(userOnduty.workingDate)}</div>
                    <div className="col-1">{extractTimeFromDate(userOnduty.timeFrom)}</div>
                <div className="col-1">{extractTimeFromDate(userOnduty.timeTo)}</div>


                   
                    
                    <div className="col-1">
                      {getStatusText(userOnduty.status)}
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-around">
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate(
                            "/userOnduty/userOndutyupsert/" + userOnduty.id
                          )
                        }
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      {(userData.role === SD_Roles.SuperAdmin ) && ( 
                      <button
                        className="btn btn-danger"
                        onClick={() => handleUserOndutyDelete(userOnduty.id)}
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

export default UserOndutyList;
