import React, { useEffect, useState } from "react";
import {
  useCreateLeaveMutation,
  useGetLeaveByIdQuery,
  useUpdateLeaveMutation,
} from "../../Apis/leaveApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";

const initialLeaveData = {
  leaveName: "",
  paidLeaveDays: "",
};

function LeaveUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaveInputs, setLeaveInputs] = useState(initialLeaveData);
  const [loading, setLoading] = useState(false);
  const [createLeave] = useCreateLeaveMutation();
  const [updateLeave] = useUpdateLeaveMutation();
  const { data } = useGetLeaveByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        leaveName: data.result.leaveName,
        paidLeaveDays: data.result.paidLeaveDays,
      };
      setLeaveInputs(tempData);
    }
  }, [data]);

  const handleLeaveInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tempData = inputHelper(e, leaveInputs);
    setLeaveInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("leaveName", leaveInputs.leaveName);
    formData.append("paidLeaveDays", leaveInputs.paidLeaveDays);
    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateLeave({ data: formData, id });
      toastNotify("Leave updated successfully", "success");
    } else {
      // create
      response = await createLeave(formData);
      toastNotify("Leave created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/leave/leavelist");
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
              placeholder="Enter Name"
              required
              name="leaveName"
              value={leaveInputs.leaveName}
              onChange={handleLeaveInput}
            />
             <input
              type="text"
              className="form-control"
              placeholder="Enter Days"
              required
              name="paidLeaveDays"
              value={leaveInputs.paidLeaveDays}
              onChange={handleLeaveInput}
            />
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
                  onClick={() => navigate("/leave/leavelist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Leave
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LeaveUpsert;
