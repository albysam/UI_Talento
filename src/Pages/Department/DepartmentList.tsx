import React, { useState } from "react";
import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from "../../Apis/departmentApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { departmentModel } from "../../Interfaces";
import { useNavigate } from "react-router";

function DepartmentList() {
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetDepartmentsQuery({
    searchString,
  });
 
  const navigate = useNavigate();
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  const handleDepartmentDelete = async (id: number) => {
    toast.promise(
      deleteDepartment(id),
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
      {!isLoading &&  (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Department List</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/department/departmentupsert")}
            >
              Add New Department
            </button>
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
              <div className="col-1">ID</div>
              <div className="col-2">Name</div>
              <div className="col-1">Action</div>
            </div>
            
            {data && data.result && data.result.length > 0 && data.result.map((department: departmentModel) =>{

           return (
              <div className="row border" >
                <div className="col-1">{department.id}</div>
                <div className="col-2">{department.departmentName}</div>
                <div className="col-1 d-flex align-items-center justify-content-around">
  <button className="btn btn-success" onClick={() => navigate("/department/departmentupsert/" + department.id)}>
    <i className="bi bi-pencil-fill"></i>
  </button>
  <button className="btn btn-danger" onClick={() => handleDepartmentDelete(department.id)}>
    <i className="bi bi-trash-fill"></i>
  </button>
</div>

              </div>
             );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default DepartmentList;