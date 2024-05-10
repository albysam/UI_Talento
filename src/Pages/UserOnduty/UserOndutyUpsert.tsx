import React, { useEffect, useState } from "react";
import {
  useCreateUserOndutyMutation,
  useGetUserOndutyByIdQuery,
  useUpdateUserOndutyMutation,
} from "../../Apis/userOndutyApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SD_Onduty, SD_Roles } from "../../Utility/SD";
import { applicationUserModel, userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
const initialUserOndutyData = {
 
  userId: "",

  workingDate: "",

  timeFrom: "",
  timeTo: "",
  comment: "",
  status: 0,
  note: "",
 
};

function UserOndutyUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userOndutyInputs, setUserOndutyInputs] = useState(initialUserOndutyData);
  const [loading, setLoading] = useState(false);
  const [createUserOnduty] = useCreateUserOndutyMutation();
  const [updateUserOnduty] = useUpdateUserOndutyMutation();
  const { data } = useGetUserOndutyByIdQuery(id);
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const extractTimeFromDate = (dateTimeString: string | number | Date) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
   
    if (loggedInUser) {
      setUserOndutyInputs(prevInputs => ({
        ...prevInputs,
        userId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
       
        userId: data.result.userId,
       
        workingDate: data.result.workingDate,
        timeFrom: extractTimeFromDate(data.result.timeFrom), 
        timeTo: extractTimeFromDate(data.result.timeTo),    
        comment: data.result.comment,
     
        status: data.result.status,

        note: data.result.note,
      
      };
      setUserOndutyInputs(tempData);
    }
  }, [data]);

  const handleUserOndutyInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userOndutyInputs);
    setUserOndutyInputs({
      ...tempData,
      timeFrom: tempData.timeFrom || "", 
      timeTo: tempData.timeTo || "",    
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
   
    formData.append("userId", userOndutyInputs.userId);
   
    formData.append("workingDate", userOndutyInputs.workingDate);
    formData.append("timeFrom", userOndutyInputs.timeFrom);
    formData.append("timeTo", userOndutyInputs.timeTo);
    formData.append("comment", userOndutyInputs.comment);
  
    formData.append("status", userOndutyInputs.status.toString());
    formData.append("note", userOndutyInputs.note);
   
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateUserOnduty({ data: formData, id });
      toastNotify("Onduty updated successfully", "success");
    } else {
      // create
      response = await createUserOnduty(formData);
      toastNotify("Onduty created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/UserOnduty/UserOndutylist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">{id ? "Edit Onduty" : "Add Onduty"}</h3>

      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
  <div className="container mt-3">
    <div className="row">
      <div className="col-md-7">
        
        <div className="mb-3">
          <input
            hidden
            type="text"
            className="form-control"
            name="userId"
            value={userOndutyInputs.userId}
            onChange={handleUserOndutyInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="workingDate" className="form-label">Onduty Date:</label>
          <DatePicker 
            className="form-control"
            selected={userOndutyInputs.workingDate ? new Date(userOndutyInputs.workingDate) : null} 
            onChange={(date) => setUserOndutyInputs({ ...userOndutyInputs, workingDate: date ? date.toISOString() : "" })} 
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="timeFrom" className="form-label">Onduty From:</label>
            <TimePicker
              id="timeFrom"
              required
              name="timeFrom"
              value={userOndutyInputs.timeFrom || ""}
              onChange={(time) => setUserOndutyInputs({ ...userOndutyInputs, timeFrom: time || "" })}
              format="h:mm a"
              clearIcon={null}
              disableClock={true}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="timeTo" className="form-label">Onduty To:</label>
          
            <TimePicker
              id="timeTo"
              required
              name="endTime"
              value={userOndutyInputs.timeTo || ""}
              onChange={(time) => setUserOndutyInputs({ ...userOndutyInputs, timeTo: time || "" })}
              format="h:mm a"
              clearIcon={null}
              disableClock={true}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment:</label>
          <textarea
            className="form-control"
            placeholder="comment"
            required
            name="comment"
            value={userOndutyInputs.comment}
            onChange={handleUserOndutyInput}
          />
        </div>

        <div className="row mb-3">
       

        {(userData.role === SD_Roles.SuperAdmin ) && (
           <div className="col-md-6">
            <label htmlFor="status" className="form-label">Status:</label>
            <select
              className="form-control form-select"
              required
              name="status"
              value={userOndutyInputs.status}
              onChange={handleUserOndutyInput}
            >
              <option value="">--Select Status--</option>
              <option value={`${SD_Onduty.Onduty_Pending}`}>Pending</option>
              <option value={`${SD_Onduty.Onduty_Approved}`}>Approved</option>
              <option value={`${SD_Onduty.Onduty_NotApproved}`}>Not Approved</option>
            </select>
            </div>
        )}
        
 {(userData.role === SD_Roles.SuperAdmin ) && (
           <div className="col-md-6">
            <label htmlFor="note" className="form-label">Note:</label>
            <textarea
              className="form-control"
              placeholder="note"
              required
              name="note"
              value={userOndutyInputs.note}
              onChange={handleUserOndutyInput}
            />
          </div>
        )}
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
              onClick={() => navigate("/userOnduty/userOndutylist")}
              className="btn btn-secondary form-control mt-3"
            >
              Back to Onduty
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</form>


    </div>
  );
}

export default UserOndutyUpsert;
