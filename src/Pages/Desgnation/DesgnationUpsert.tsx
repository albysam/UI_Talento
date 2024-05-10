// Import useState and useEffect from React
import React, { useEffect, useState } from "react";
import { useCreateDesgnationMutation, 
  useGetDesgnationByIdQuery, 
  useUpdateDesgnationMutation, 
  useGetDepartmentsListQuery  } from "../../Apis/desgnationApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { departmentModel, desgnationModel } from "../../Interfaces";


const initialDesgnationData = {
  desgnationName: "",
  departmentId: 0,
};

function DesgnationUpsert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [desgnationInputs, setDesgnationInputs] = useState(initialDesgnationData);
  const [loading, setLoading] = useState(false);
  const [createDesgnation] = useCreateDesgnationMutation();
  const [updateDesgnation] = useUpdateDesgnationMutation();
  const { data } = useGetDesgnationByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        desgnationName: data.result.desgnationName,
        departmentId: data.result.departmentId
      };
      setDesgnationInputs(tempData);
    }
  }, [data]);

  const handleDesgnationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, desgnationInputs);
    setDesgnationInputs(tempData);
  };

  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDesgnationInputs({
      ...desgnationInputs,
      departmentId: parseInt(e.target.value, 10), 
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("desgnationName", desgnationInputs.desgnationName);
      formData.append("departmentId", desgnationInputs.departmentId as unknown as string | Blob);
  
      let response;
  
      if (id) {
        // update
        formData.append("id", id); 
        console.log("Updating Desgnation:", formData);
        response = await updateDesgnation({ data: formData, id });
        console.log("Update Response:", response);
        toastNotify("Desgnation updated successfully", "success");
      } else {
        // create
        console.log("Creating Desgnation:", formData);
        response = await createDesgnation(formData);
        console.log("Create Response:", response);
        toastNotify("Desgnation created successfully", "success");
      }
  
      if (response) {
        setLoading(false);
        navigate("/desgnation/desgnationlist");
      }
    } catch (error) {
      console.error("API request failed:", error);
      toastNotify("Error occurred during the API request", "error");
    }
  
    setLoading(false);
  };
  
  
  
  const { data: departmentsData } = useGetDepartmentsListQuery({});


  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
        {id ? "Edit Desgnation" : "Add Desgnation"}
      </h3>

      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
          <select
  className="form-control"
  placeholder="Select Department"
  required
  name="departmentName"
  value={desgnationInputs.departmentId}
  onChange={handleDepartmentSelect}
>
<option value="">Select Department</option>
{departmentsData?.result.map((department: desgnationModel) => (
  <option key={department.departmentId} value={department.departmentId}>
    {department.departmentName}
  </option>
))}
 
</select>


            <input
              type="text"
              className="form-control"
              placeholder="Enter Desgnation"
              required
              name="desgnationName"
              value={desgnationInputs.desgnationName}
              onChange={handleDesgnationInput}
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
                  onClick={() => navigate("/desgnation/desgnationlist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Desgnation
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DesgnationUpsert;
