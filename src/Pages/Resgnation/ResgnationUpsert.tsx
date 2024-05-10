import React, { useEffect, useState } from "react";
import {
  useCreateResgnationMutation,
  useGetResgnationByIdQuery,
  useUpdateResgnationMutation,
} from "../../Apis/resgnationApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { applicationUserModel } from "../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { SD_Resgnation, SD_Roles } from "../../Utility/SD";
import { userModel } from "../../Interfaces";
const initialResgnationData = {
  employeeId: "",
  user: "",
  resgnationDate: "",
  reason: "",
  comment: "",
  status: 0
};

function ResgnationUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resgnationInputs, setResgnationInputs] = useState(initialResgnationData);
  const [loading, setLoading] = useState(false);
  const [createResgnation] = useCreateResgnationMutation();
  const [updateResgnation] = useUpdateResgnationMutation();
  const { data } = useGetResgnationByIdQuery(id);
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  useEffect(() => {
    
    if (loggedInUser) {
      setResgnationInputs(prevInputs => ({
        ...prevInputs,
        employeeId: loggedInUser.id
      }));
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        employeeId: data.result.employeeId,
        user: data.result.user,

        resgnationDate: data.result.resgnationDate,
        reason: data.result.reason,

        comment: data.result.comment,
        status: data.result.status,
      };
      setResgnationInputs(tempData);
    }
  }, [data]);

  const handleResgnationInput = (
    e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const tempData = inputHelper(e, resgnationInputs);
    setResgnationInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("employeeId", resgnationInputs.employeeId);
    formData.append("user", resgnationInputs.user);

    formData.append("resgnationDate", resgnationInputs.resgnationDate);
    formData.append("reason", resgnationInputs.reason);

    formData.append("comment", resgnationInputs.comment);
    formData.append("status", resgnationInputs.status.toString());
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateResgnation({ data: formData, id });
      toastNotify("Resgnation updated successfully", "success");
    } else {
      // create
      response = await createResgnation(formData);
      toastNotify("Resgnation created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/Resgnation/Resgnationlist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Resgnation" : "Add Resgnation"}
      </h3>
      
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="row mt-3">
    <div className="col-md-7">
     
      
         
            <input
              type="text"
              className="form-control"
             hidden
              required
              name="employeeId"
              value={resgnationInputs.employeeId}
              onChange={handleResgnationInput}
            />



  <div className="col-md-12">
  
    <label htmlFor="dateFrom">Resgnation Date</label>
    <DatePicker 
      className="form-control"
      selected={resgnationInputs.resgnationDate ? new Date(resgnationInputs.resgnationDate) : null} 
      onChange={(date) => setResgnationInputs({ ...resgnationInputs, resgnationDate: date ? date.toISOString() : "" })} 
    />
  </div>
 

  <div className="col-md-12">
  <label htmlFor="reason">Reason:</label>
  <textarea
    className="form-control"
    
    required
    name="reason"
    value={resgnationInputs.reason}
    onChange={handleResgnationInput}
    rows={8} // Set the number of visible rows
  />
</div>
{(userData.role === SD_Roles.SuperAdmin ) && (
<div className="col-md-12">
  <label htmlFor="comment">Comment:</label>
  <textarea
    className="form-control"
   
    required
    name="comment"
    value={resgnationInputs.comment}
    onChange={handleResgnationInput}
    rows={4} // Set the number of visible rows
  />
</div>
)}
{(userData.role === SD_Roles.SuperAdmin ) && (    
<div className="col-md-6">
          <label htmlFor="status">Status:</label>
          <select
            className="form-control form-select"
            required
            name="status"
            value={resgnationInputs.status}
            onChange={handleResgnationInput}
          >
            <option value="">--Select Status--</option>
            <option value={`${SD_Resgnation.Resgnation_Pending}`}>Pending</option>
            <option value={`${SD_Resgnation.Resgnation_Approved}`}>Approved</option>
            <option value={`${SD_Resgnation.Resgnation_NotApproved}`}>Not Approved</option>
          </select>
        </div>
)}

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
                  onClick={() => navigate("/Resgnation/Resgnationlist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Resgnation
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResgnationUpsert;
