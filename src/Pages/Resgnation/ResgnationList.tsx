import React, { useState } from "react";
import {
  useDeleteResgnationMutation,
  useGetResgnationsQuery,
} from "../../Apis/resgnationApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { resgnationModel } from "../../Interfaces";
import { useNavigate } from "react-router";
import { SD_Resgnation, SD_Roles } from "../../Utility/SD"; 
import { userModel } from "../../Interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Storage/Redux/store";

function ResgnationList() {
  const [deleteResgnation] = useDeleteResgnationMutation();
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useGetResgnationsQuery({
    searchString,
  });
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const navigate = useNavigate();

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Not Approved";
      default:
        return "Unknown";
    }
  };

  const handleResgnationDelete = async (id: number) => {
    toast.promise(
      deleteResgnation(id),
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
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Resgnation List</h1>
            {(userData.role !== SD_Roles.SuperAdmin && !data.result.some((resgnation: { employeeId: string; }) => resgnation.employeeId === userData.id)) && (
            <button
              className="btn btn-success"
              onClick={() => navigate("/Resgnation/Resgnationupsert")}
            >
              Add Resgnation
            </button>
            
            )}
          </div>

          {/* Search input */}
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
            <div className="col-1">SL.No</div> 
              <div className="col-2">Employee Name</div>
              <div className="col-2">Email Id</div>
              <div className="col-2">Resgnation Date</div>
              <div className="col-2">Status</div>
              <div className="col-1">Action</div>
            </div>
            {data &&
              data.result &&
              data.result.length > 0 &&
              data.result
              .filter((resgnation: resgnationModel) =>
              (userData.role === SD_Roles.SuperAdmin ) ? true : resgnation.employeeId === userData.id
            )
                
                .map((resgnation: resgnationModel, index: number) => (
                  <div className="row border" key={resgnation.id}>
                     <div className="col-1">{index + 1}</div> 
                    <div className="col-2">{resgnation.name}</div>
                    <div className="col-2">{resgnation.userName}</div>
                    <div className="col-2">
                      {resgnation.resgnationDate.substring(0, 10)}
                    </div>
                    <div className="col-2">
                      {getStatusText(resgnation.status)}
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-around">
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate(
                            "/resgnation/resgnationupsert/" + resgnation.id
                          )
                        }
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>

                      {(userData.role === SD_Roles.SuperAdmin ) && (  
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate(
                            "/applicationuser/applicationuserupsertAdmin/" +
                              resgnation.employeeId
                          )
                        }
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ResgnationList;
