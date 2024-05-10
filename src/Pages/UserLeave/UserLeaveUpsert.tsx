import React, { useEffect, useState } from "react";
import {
  useCreateUserLeaveMutation,
  useGetUserLeaveByIdQuery,
  useUpdateUserLeaveMutation,
  useGetLeavesListQuery
} from "../../Apis/userLeaveApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SD_Leave, SD_Leaves, SD_Roles } from "../../Utility/SD";
import { applicationUserModel, userLeaveModel, userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";


const initialLeaveData = {
  leaveId: 0,
  userId: "",
  leaveDays: "",
  approvedStatus: "",
  comment: "",
  type: "",
  dateFrom: "",
  dateTo: "",
  status: 0,
  reason: ""
};

function UserLeaveUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userLeaveInputs, setUserLeaveInputs] = useState(initialLeaveData);
  const [loading, setLoading] = useState(false);
  const [createUserLeave] = useCreateUserLeaveMutation();
  const [updateUserLeave] = useUpdateUserLeaveMutation();
  const { data } = useGetUserLeaveByIdQuery(id);
  const { data: leavesData } = useGetLeavesListQuery({});
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  useEffect(() => {
   
    if (loggedInUser) {
      setUserLeaveInputs(prevInputs => ({
        ...prevInputs,
        userId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        leaveId: data.result.leaveId,
        userId: data.result.userId,
        leaveDays: data.result.leaveDays,
        approvedStatus: data.result.approvedStatus,
        comment: data.result.comment,
        type: data.result.type,
        dateFrom: data.result.dateFrom,
        dateTo: data.result.dateTo,
        status: data.result.status,

        reason: data.result.reason,
      };
      setUserLeaveInputs(tempData);
    }
  }, [data]);

  const handleUserLeaveInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userLeaveInputs);
    setUserLeaveInputs(tempData);
  };

  const handleLeaveSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserLeaveInputs({
      ...userLeaveInputs,
      leaveId: parseInt(e.target.value, 10), 
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("leaveId", userLeaveInputs.leaveId.toString());
    formData.append("userId", userLeaveInputs.userId);
    formData.append("leaveDays", userLeaveInputs.leaveDays);
    formData.append("approvedStatus", userLeaveInputs.approvedStatus);
    formData.append("comment", userLeaveInputs.comment);
    formData.append("type", userLeaveInputs.type);
    formData.append("dateFrom", userLeaveInputs.dateFrom);
    formData.append("dateTo", userLeaveInputs.dateTo);
    formData.append("status", userLeaveInputs.status.toString());
    formData.append("reason", userLeaveInputs.reason);
    
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateUserLeave({ data: formData, id });
      toastNotify("Leave updated successfully", "success");
    } else {
     
      const selectedLeave = leavesData?.result.find(
        (leave: userLeaveModel) => leave.leaveId === userLeaveInputs.leaveId
      );
  
      
      if (selectedLeave && selectedLeave.paidLeaveDays) {
        const paidLeaveDays = parseInt(selectedLeave.paidLeaveDays, 10);
        const leaveDays = parseInt(userLeaveInputs.leaveDays, 10);
  
        if (leaveDays > paidLeaveDays) {
          toastNotify(
            "You cannot apply for more leave than the allowed paid leave days",
            "error"
          );
          setLoading(false);
          return;
        }
      }
  
      response = await createUserLeave(formData);
      toastNotify("Leave created successfully", "success");
    }
  
    if (response) {
      setLoading(false);
      navigate("/userLeave/userLeavelist");
    }
  
    setLoading(false);
  };
  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Leave" : "Add Leave"}
      </h3>

      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">

          <input
              type="text"
              className="form-control"
              hidden
              required
              name="userId"
              value={userLeaveInputs.userId}
              onChange={handleUserLeaveInput}
            />

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="leaveId">Leave Name:</label>
                <select
                  className="form-control form-select"
                  required
                  name="leaveId"
                  value={userLeaveInputs.leaveId}
                  onChange={handleLeaveSelect}
                >
                  <option value="">--Select Leave Name--</option>
                  {leavesData?.result.map((leave: userLeaveModel) => (
                    <option key={leave.leaveId} value={leave.leaveId}>
                      {leave.leaveName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
             <div className="col-md-6">
          <label htmlFor="type">Leave Type:</label>
          <select
            className="form-control form-select"
            required
            name="type"
            value={userLeaveInputs.type}
            onChange={handleUserLeaveInput}
          >
            <option value="">--Select Leave Type--</option>
            <option value={`${SD_Leaves.Fullday}`}>full day</option>
            <option value={`${SD_Leaves.Halfday}`}>half day</option>
          </select>
        </div>
        </div>
        <div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="leaveId">Number of days:</label>   
<input
              type="text"
              className="form-control"
              placeholder="Number of days"
              
              name="leaveDays"
              value={userLeaveInputs.leaveDays}
              onChange={handleUserLeaveInput}
            />
</div>
</div>


<div className="row mt-3">
  <div className="col-md-6">
    <label htmlFor="dateFrom">Date From:</label>
    <DatePicker 
      className="form-control"
      selected={userLeaveInputs.dateFrom ? new Date(userLeaveInputs.dateFrom) : null} 
      onChange={(date) => setUserLeaveInputs({ ...userLeaveInputs, dateFrom: date ? date.toISOString() : "" })} 
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="dateTo">Date To:</label>
    <DatePicker 
      className="form-control"
      selected={userLeaveInputs.dateTo ? new Date(userLeaveInputs.dateTo) : null} 
      onChange={(date) => setUserLeaveInputs({ ...userLeaveInputs, dateTo: date ? date.toISOString() : "" })} 
    />
  </div>
</div>
<div className="row">
        <div className="col-md-6">
          <label htmlFor="reason">Reason:</label> 
<textarea
  className="form-control"
  placeholder="Reason"
  required
  name="reason"
  value={userLeaveInputs.reason}
  onChange={handleUserLeaveInput}
/>

</div>
</div>
{(userData.role === SD_Roles.SuperAdmin ) && ( 


<div className="row">
        <div className="col-md-6">
          <label htmlFor="comment">Comment:</label> 
<textarea
  className="form-control"
  placeholder="Comment"
  required
  name="comment"
  value={userLeaveInputs.comment}
  onChange={handleUserLeaveInput}
/>

</div>
</div>
)}
{(userData.role === SD_Roles.SuperAdmin ) && (    
<div className="col-md-6">
          <label htmlFor="status">Status:</label>
          <select
            className="form-control form-select"
            required
            name="status"
            value={userLeaveInputs.status}
            onChange={handleUserLeaveInput}
          >
            <option value="">--Select Status--</option>
            <option value={`${SD_Leave.Leave_Pending}`}>Pending</option>
            <option value={`${SD_Leave.Leave_Approved}`}>Approved</option>
            <option value={`${SD_Leave.Leave_NotApproved}`}>Not Approved</option>
          </select>
        </div>
)}




          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button
              type="submit"
              className="btn btn-success form-control mt-3"
            >
              {id ? "Update" : "Create"}
            </button>
          </div>
          <div className="col-6">
            <a
              onClick={() => navigate("/userLeave/userLeavelist")}
              className="btn btn-secondary form-control mt-3"
            >
              Back to Leave
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserLeaveUpsert;
