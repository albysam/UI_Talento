import React, { useEffect, useState } from "react";
import {
  useCreateDepartmentMutation,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
} from "../../Apis/departmentApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";

const initialDepartmentData = {
  departmentName: "",
};

function DepartmentUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departmentInputs, setDepartmentInputs] = useState(initialDepartmentData);
  const [loading, setLoading] = useState(false);
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const { data } = useGetDepartmentByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        departmentName: data.result.departmentName,
      };
      setDepartmentInputs(tempData);
    }
  }, [data]);

  const handleDepartmentInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tempData = inputHelper(e, departmentInputs);
    setDepartmentInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("departmentName", departmentInputs.departmentName);

    let response;

    if (id) {
      // update
      formData.append("Id", id);
      response = await updateDepartment({ data: formData, id });
      toastNotify("Department updated successfully", "success");
    } else {
      // create
      response = await createDepartment(formData);
      toastNotify("Department created successfully", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/department/departmentlist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Department" : "Add Department"}
      </h3>
      
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="departmentName"
              value={departmentInputs.departmentName}
              onChange={handleDepartmentInput}
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
                  onClick={() => navigate("/department/departmentlist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Department
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DepartmentUpsert;
