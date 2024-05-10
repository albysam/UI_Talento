import React, { useState } from "react";
import {
  useDeleteDesgnationMutation,
  useGetDesgnationsQuery,
} from "../../Apis/desgnationApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { desgnationModel } from "../../Interfaces";
import { useNavigate } from "react-router";

function DesgnationList() {
  const [deleteDesgnation] = useDeleteDesgnationMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetDesgnationsQuery({
    searchString,
  });

  const navigate = useNavigate();
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  const handleDepartmentDelete = async (id: number) => {
    toast.promise(
      deleteDesgnation(id),
      {
        pending: "Processing your request...",
        success: "Desgnation Deleted Successfully 👌",
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
            <h1 className="text-success">DesgnationList</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/desgnation/desgnationupsert")}
            >
              Add New Desgnation
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
    <div className="col-2">Department</div>
    <div className="col-2">Desgnation</div>
    <div className="col-1">Action</div>
  </div>

  {data &&
  data.result &&
  data.result.length > 0 &&
  data.result.map((desgnation: desgnationModel, index: number) => {
    return (
      <div className="row border" key={desgnation.id || index}>
        <div className="col-1">{desgnation.id}</div>
        <div className="col-2">{desgnation.departmentName}</div>
        <div className="col-2">{desgnation.desgnationName}</div>
        <div className="col-1 d-flex align-items-center justify-content-around">
          <button
            className="btn btn-success"
            onClick={() =>
              navigate("/desgnation/desgnationupsert/" + desgnation.id)
            }
          >
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDepartmentDelete(desgnation.id)}
          >
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

export default DesgnationList;