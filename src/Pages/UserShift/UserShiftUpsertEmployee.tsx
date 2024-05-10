import React, { useEffect, useState } from "react";
import {
  useCreateUserShiftMutation,
  useGetUserShiftByIdQuery,
  useUpdateUserShiftMutation,
  useGetShiftsListQuery
} from "../../Apis/userShiftApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { applicationUserModel, userShiftModel, userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";


const initialShiftData = {
  shiftId: 0,
  userId: "",
  date: "",
  shiftDateFrom: "",
  shiftDateTo: "",
  comment: "",

};

function UserShiftUpsert() {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const [userShiftInputs, setUserShiftInputs] = useState(initialShiftData);
  const [loading, setLoading] = useState(false);
  const [createUserShift] = useCreateUserShiftMutation();
  const [updateUserShift] = useUpdateUserShiftMutation();
  const { data } = useGetUserShiftByIdQuery(id);
  const { data: shiftsData } = useGetShiftsListQuery({});
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  useEffect(() => {
   
    if (loggedInUser) {
      setUserShiftInputs(prevInputs => ({
        ...prevInputs,
        userId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        shiftId: data.result.shiftId,
        userId: data.result.userId,
       
  date: data.result.date,
  shiftDateFrom: data.result.shiftDateFrom,
  shiftDateTo: data.result.shiftDateTo,
  comment: data.result.comment,

      };
      setUserShiftInputs(tempData);
    }
  }, [data]);

  const handleUserShiftInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userShiftInputs);
    setUserShiftInputs(tempData);
  };

  const handleShiftSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserShiftInputs({
      ...userShiftInputs,
    shiftId: parseInt(e.target.value, 10), 
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
// Get today's date
const today = new Date();
const todayDate = today.toISOString().split('T')[0];  


    const formData = new FormData();
    formData.append("shiftId", userShiftInputs.shiftId.toString());
    // Check if id exists before appending
  if (id) {
    formData.append("userId", id);
  } else {
    console.error("User ID is undefined");
  }
  formData.append("date", todayDate);  // Append today's date
    formData.append("shiftDateFrom", userShiftInputs.shiftDateFrom);
    formData.append("shiftDateTo", userShiftInputs.shiftDateTo);
    formData.append("comment", userShiftInputs.comment);

    
    let response;

   
      // create
      response = await createUserShift(formData);
      toastNotify("Shift created successfully", "success");
    

    if (response) {
      setLoading(false);
      navigate(`/userShift/UserShiftListemployee/${id}`);
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {"Add Shift"}
      </h3>

      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">

          <input
            type="text"
            className="form-control"
            hidden
            name="userId"
            value={id}
            onChange={handleUserShiftInput}
            readOnly 
        />

            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="ShiftId">Shift Name:</label>
                <select
                  className="form-control form-select"
                  required
                  name="ShiftId"
                  value={userShiftInputs.shiftId}
                  onChange={handleShiftSelect}
                >
                  <option value="">--Select Shift Name--</option>
                  {shiftsData?.result.map((shift: userShiftModel) => (
                    <option key={shift.shiftId} value={shift.shiftId}>
                      {shift.shiftName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
           
       


<div className="row mt-3">
  <div className="col-md-6">
    <label htmlFor="shiftdateFrom">Date From:</label>
    <DatePicker 
      className="form-control"
      selected={userShiftInputs.shiftDateFrom ? new Date(userShiftInputs.shiftDateFrom) : null} 
      onChange={(date) => setUserShiftInputs({ ...userShiftInputs, shiftDateFrom: date ? date.toISOString() : "" })} 
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="shiftdateTo">Date To:</label>
    <DatePicker 
      className="form-control"
      selected={userShiftInputs.shiftDateTo ? new Date(userShiftInputs.shiftDateTo) : null} 
      onChange={(date) => setUserShiftInputs({ ...userShiftInputs, shiftDateTo: date ? date.toISOString() : "" })} 
    />
  </div>
</div>




<div className="row">
        <div className="col-md-6">
          <label htmlFor="comment">Comment:</label> 
<textarea
  className="form-control"
  placeholder="Comment"
  required
  name="comment"
  value={userShiftInputs.comment}
  onChange={handleUserShiftInput}
/>

</div>
</div>

          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button
              type="submit"
              className="btn btn-success form-control mt-3"
            >
              {"Create"}
            </button>
          </div>
          <div className="col-6">
            <a
              onClick={() => navigate(`/userShift/UserShiftListemployee/${id}`)}
              className="btn btn-secondary form-control mt-3"
            >
              Back to Shift
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserShiftUpsert;
