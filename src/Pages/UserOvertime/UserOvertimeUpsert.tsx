import React, { useEffect, useState } from "react";
import {
  useCreateUserOvertimeMutation,
  useGetUserOvertimeByIdQuery,
  useUpdateUserOvertimeMutation,
} from "../../Apis/userOvertimeApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SD_Overtime, SD_Roles } from "../../Utility/SD";
import { applicationUserModel, userModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
const initialUserOvertimeData = {
 
  userId: "",

  overtimeDate: "",

  overtimeFrom: "",
  overtimeTo: "",
  comment: "",
  status: 0,
  note: "",
 
};

function UserOvertimeUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userOvertimeInputs, setUserOvertimeInputs] = useState(initialUserOvertimeData);
  const [loading, setLoading] = useState(false);
  const [createUserOvertime] = useCreateUserOvertimeMutation();
  const [updateUserOvertime] = useUpdateUserOvertimeMutation();
  const { data } = useGetUserOvertimeByIdQuery(id);
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
      setUserOvertimeInputs(prevInputs => ({
        ...prevInputs,
        userId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
       
        userId: data.result.userId,
       
        overtimeDate: data.result.overtimeDate,
        overtimeFrom: extractTimeFromDate(data.result.overtimeFrom), 
        overtimeTo: extractTimeFromDate(data.result.overtimeTo),    
        comment: data.result.comment,
     
        status: data.result.status,

        note: data.result.note,
      
      };
      setUserOvertimeInputs(tempData);
    }
  }, [data]);

  const handleUserOvertimeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userOvertimeInputs);
    setUserOvertimeInputs({
      ...tempData,
      overtimeFrom: tempData.overtimeFrom || "", 
      overtimeTo: tempData.overtimeTo || "",    
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
   
    formData.append("userId", userOvertimeInputs.userId);
   
    formData.append("overtimeDate", userOvertimeInputs.overtimeDate);
    formData.append("overtimeFrom", userOvertimeInputs.overtimeFrom);
    formData.append("overtimeTo", userOvertimeInputs.overtimeTo);
    formData.append("comment", userOvertimeInputs.comment);
  
    formData.append("status", userOvertimeInputs.status.toString());
    formData.append("note", userOvertimeInputs.note);
   
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateUserOvertime({ data: formData, id });
      toastNotify("Overtime updated successfully", "success");
    } else {
      // create
      response = await createUserOvertime(formData);
      toastNotify("Overtime created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/UserOvertime/UserOvertimelist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">{id ? "Edit Overtime" : "Add Overtime"}</h3>

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
            value={userOvertimeInputs.userId}
            onChange={handleUserOvertimeInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="overtimeDate" className="form-label">Overtime Date:</label>
          <DatePicker 
            className="form-control"
            selected={userOvertimeInputs.overtimeDate ? new Date(userOvertimeInputs.overtimeDate) : null} 
            onChange={(date) => setUserOvertimeInputs({ ...userOvertimeInputs, overtimeDate: date ? date.toISOString() : "" })} 
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="overtimeFrom" className="form-label">Overtime From:</label>
            <TimePicker
              id="overtimeFrom"
              required
              name="overtimeFrom"
              value={userOvertimeInputs.overtimeFrom || ""}
              onChange={(time) => setUserOvertimeInputs({ ...userOvertimeInputs, overtimeFrom: time || "" })}
              format="h:mm a"
              clearIcon={null}
              disableClock={true}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="overtimeTo" className="form-label">Overtime To:</label>
          
            <TimePicker
              id="overtimeTo"
              required
              name="endTime"
              value={userOvertimeInputs.overtimeTo || ""}
              onChange={(time) => setUserOvertimeInputs({ ...userOvertimeInputs, overtimeTo: time || "" })}
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
            value={userOvertimeInputs.comment}
            onChange={handleUserOvertimeInput}
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
              value={userOvertimeInputs.status}
              onChange={handleUserOvertimeInput}
            >
              <option value="">--Select Status--</option>
              <option value={`${SD_Overtime.Overtime_Pending}`}>Pending</option>
              <option value={`${SD_Overtime.Overtime_Approved}`}>Approved</option>
              <option value={`${SD_Overtime.Overtime_NotApproved}`}>Not Approved</option>
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
              value={userOvertimeInputs.note}
              onChange={handleUserOvertimeInput}
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
              onClick={() => navigate("/userOvertime/userOvertimelist")}
              className="btn btn-secondary form-control mt-3"
            >
              Back to Overtime
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

export default UserOvertimeUpsert;
