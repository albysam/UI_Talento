import React, { useState, useEffect } from "react";
import {
  useDeleteApplicationUserMutation,
  useGetApplicationUsersQuery,
  useBlockApplicationUserMutation,
  useUnblockApplicationUserMutation
} from "../../Apis/applicationUserApi";
import { toast } from "react-toastify";
import { MainLoader } from "../../Components/Page/Common";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { applicationUserModel, userModel } from "../../Interfaces";
import { useNavigate } from "react-router";
import { SD_Roles } from "../../Utility/SD";
let logo = require("../../Assets/Images/download.png");

function ApplicationUserList() {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const [deleteApplicationUser] = useDeleteApplicationUserMutation();
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1); // Current page number
  const pageSize = 5; // Number of items per page
  const [serialNumber, setSerialNumber] = useState(1); // Initialize serial number
  const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const loggedInUser1: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const department = loggedInUser1.department || "";
  const {
    data,
    isLoading,
    isFetching,
  } = useGetApplicationUsersQuery({
    searchString,
    department: loggedInUser1.department,
    pageNumber,
    pageSize,
  });

  const handleApplicationUserDelete = async (id: string) => {
    try {
      await deleteApplicationUser(id);
      toast.success("Deleted Successfully 👌", { theme: "dark" });
    } catch (error) {
      toast.error("Error encountered 🤯", { theme: "dark" });
      console.error("Error deleting application user:", error);
    }
  };

  const showAddUserButton = loggedInUser1.role !== SD_Roles.ADMIN;
  const showAddUserButton1 = loggedInUser1.role !== SD_Roles.SuperAdmin;
  const showAddUserButton2 = loggedInUser1.role !== SD_Roles.Employee;


  
  const [blockApplicationUser] = useBlockApplicationUserMutation();
  const [unblockApplicationUser] = useUnblockApplicationUserMutation();

  

  const handleBlockUser = async (id: string) => {
    try {
      await blockApplicationUser(id);
      toast.success("User Blocked Successfully 👌", { theme: "dark" });
    } catch (error) {
      toast.error("Error blocking user 🤯", { theme: "dark" });
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async (id: string) => {
    try {
      await unblockApplicationUser(id);
      toast.success("User Unblocked Successfully 👌", { theme: "dark" });
    } catch (error) {
      toast.error("Error unblocking user 🤯", { theme: "dark" });
      console.error("Error unblocking user:", error);
    }
  };
  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  
  const delayedSearch = debounce((value: string) => {
    setSearchString(value);
  }, 500); // 300ms delay

  useEffect(() => {
    delayedSearch(searchString);
  }, [searchString]);
 // Calculate the starting serial number for the current page
 const startingSerialNumber = (pageNumber - 1) * pageSize + 1;
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">User List</h1>
            {showAddUserButton && (
              <button
                className="btn btn-success"
                onClick={() => navigate("../register")}
              >
                Add New User
              </button>
            )}
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
            <div className="col-1">SL.No</div> 
              <div className="col-1">Image</div>
              <div className="col-1">ID</div>
              <div className="col-2">Name</div>
              <div className="col-2">Email</div>
              <div className="col-1">Role</div>
              <div className="col-2">Actions</div>
            </div>

            {data.result
              .filter(
                (applicationUser: { id: string }) =>
                  applicationUser.id !== loggedInUser.id
              )
              .map((applicationUser: applicationUserModel, index: number) => ( 
                <div className="row border" key={applicationUser.id}>
                   <div className="col-1">{startingSerialNumber + index}</div> 
                <div className="col-1">
                  <img
                    src={applicationUser.image ?? logo}
                    alt="no content"
                    style={{ width: "100%", maxWidth: "120px" }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = logo;
                    }}
                  />
                </div>
                <div className="col-1">{applicationUser.id}</div>
                <div className="col-2">{applicationUser.name}</div>
                <div className="col-2">{applicationUser.email}</div>
                <div className="col-1">{applicationUser.roles}</div>

                {showAddUserButton  &&(
                                   <div className="col-1">
                                     <button className="btn btn-success">
                                       <i
                                         className="bi bi-pencil-fill"
                                         onClick={() =>
                                           navigate(
                                             "/applicationuser/applicationuserupsertAdmin/" +
                                               applicationUser.id
                                           )
                                         }
                                       ></i>
                                     </button>
                                     </div>

)}



{showAddUserButton2 && !showAddUserButton &&(
                                   <div className="col-1">
                                     <button className="btn btn-success">
                                       <i
                                         className="bi bi-pencil-fill"
                                         onClick={() =>
                                           navigate(
                                             "/applicationuser/applicationuserupsertAdminEmployee/" +
                                               applicationUser.id
                                           )
                                         }
                                       ></i>
                                     </button>
                                     </div>

)}
  {showAddUserButton && (
         
<div className="col-1">
              {applicationUser.status === 0 ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleBlockUser(applicationUser.id)}
                >
                  Block
                </button>
              ) : (
                <button
                  className="btn btn-warning"
                  onClick={() => handleUnblockUser(applicationUser.id)}
                >
                  Unblock
                </button>
              )}
            </div>

)}                   
        
        {showAddUserButton && (
         
         <div className="col-2">
         <div className="btn-group">
           <button 
             className="btn btn-success dropdown-toggle"
             type="button"
             data-bs-toggle="dropdown"
             aria-expanded="false"
           >
             View
           </button>
           <ul className="dropdown-menu">
             <li>
               <a 
                 className="dropdown-item"
                 href={`/userShift/UserShiftListemployee/${applicationUser.id}`}
               >
                 View Shift
               </a>
             </li>
             <li>
               <a 
                 className="dropdown-item"
                 href={`/attendence/attendenceadminlistemployee/${applicationUser.id}`}
               >
                 View Attendence
               </a>
             </li>
           </ul>
         </div>
       </div>
       
         
         )}    
    
        {/*
                                     <div className="col-1">
                                     <button
                                       className="btn btn-danger mx-2"
                                       onClick={() =>
                                         handleApplicationUserDelete(applicationUser.id)
                                       }
                                     >
                                       <i className="bi bi-trash-fill"></i>
                                     </button>
                                      </div> */}

               
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>{pageNumber}</span>
            <button
              disabled={data.result.length < pageSize}
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              Next
            </button>
            {isFetching && <span> Loading...</span>}
          </div>
        </div>
      )}
    </>
  );
}

export default ApplicationUserList;
