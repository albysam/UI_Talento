import React, { useEffect, useState } from "react";
import {
  useCreateWorkingDayMutation,
  useGetWorkingDayByIdQuery,
  useUpdateWorkingDayMutation,
} from "../../Apis/workingDayApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";

const initialWorkingDayData = {
  workingDays: "",
};

function WorkingDayUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workingDayInputs, setWorkingDayInputs] = useState(initialWorkingDayData);
  const [loading, setLoading] = useState(false);
  const [createWorkingDay] = useCreateWorkingDayMutation();
  const [updateWorkingDay] = useUpdateWorkingDayMutation();
  const { data } = useGetWorkingDayByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        workingDays: data.result.workingDays,
      };
      setWorkingDayInputs(tempData);
    }
  }, [data]);

  const handleWorkingDayInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tempData = inputHelper(e, workingDayInputs);
    setWorkingDayInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("workingDays", workingDayInputs.workingDays);

    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateWorkingDay({ data: formData, id });
      toastNotify("workingDays updated successfully", "success");
    } else {
      // create
      response = await createWorkingDay(formData);
      toastNotify("Working Day created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/workingDay/workingDaylist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Working Day" : "Add Working Day"}
      </h3>
      
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="workingDays"
              value={workingDayInputs.workingDays}
              onChange={handleWorkingDayInput}
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
                  onClick={() => navigate("/workingDay/workingDaylist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Working Day
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default WorkingDayUpsert;
