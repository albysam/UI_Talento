import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { userModel } from "../../Interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import {
  emptyUserState,
  setLoggedInUser,
} from "../../Storage/Redux/userAuthSlice";
import { SD_Roles } from "../../Utility/SD";
import { Dropdown } from "react-bootstrap";
let logo = require("../../Assets/Images/mango.png");

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <NavLink className="nav-link" aria-current="page" to="/">
            <img src={logo} style={{ height: "40px" }} className="m-1" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
            {(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN || userData.role === SD_Roles.SuperAdmin) && (
  <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              </React.Fragment>
    )}


{(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN ) && (
  

<React.Fragment>
<li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Requests
              </a>
              <ul className="dropdown-menu">
         
   
              <li
                  style={{ cursor: "pointer" }}
                  className="dropdown-item"
                  onClick={() => navigate("userLeave/userLeaveList")}
                >
                    Apply Leave
                </li>




                <li
                  style={{ cursor: "pointer" }}
                  className="dropdown-item"
                  onClick={() => navigate("userOvertime/userOvertimeList")}
                >
                 Apply Overtime 
                </li>
                <li
                  style={{ cursor: "pointer" }}
                  className="dropdown-item"
                  onClick={() => navigate("userOnduty/userOndutyList")}
                >
                 Onduty Request 
                </li>
                <li
                  style={{ cursor: "pointer" }}
                  className="dropdown-item"
                  onClick={() => navigate("resgnation/resgnationList")}
                >
                  Resgnation Request
                </li>
              
              </ul>
            </li>
          
          

</React.Fragment>




    )}


             {(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN) && (
  <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" to="attendence/attendenceList">
                 Attendence Management
                </NavLink>
              </li>
              </React.Fragment>
              )}
      {(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN) && (
  <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" to="/applicationUser/applicationusersalaryemplist">
                 Salary Management
                </NavLink>
              </li>
              </React.Fragment>
              )}
              {(userData.role === SD_Roles.SuperAdmin || userData.role === SD_Roles.ADMIN) && (
  <React.Fragment>
    <li className="nav-item">
      <NavLink className="nav-link" to="applicationUser/applicationuserlist">
        Users List
      </NavLink>
    </li>
    </React.Fragment>
    )}

{(userData.role === SD_Roles.SuperAdmin) && (
     <React.Fragment>
    <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Employee Requests
                  </a>
                  <ul className="dropdown-menu">
             
                  <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("userOvertime/userOvertimeList")}
                    >
                       Overtime Requests
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("userOnduty/userOndutyList")}
                    >
                       Onduty Requests
                    </li>


                  <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("userLeave/userLeaveList")}
                    >
                       Leave Requests
                    </li>




                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("resgnation/resgnationList")}
                    >
                     Resgnation Requests
                    </li>
                   
                   
                  
                  </ul>
                </li>
              
              
   
  </React.Fragment>
 )}















{(userData.role === SD_Roles.SuperAdmin) && (
     <React.Fragment>
    <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Managements
                  </a>
                  <ul className="dropdown-menu">
             
                 
                  <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("attendence/attendenceadminList")}
                    >
                       Attendence Management
                    </li>




                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("userShift/userShiftlist")}
                    >
                     Employee Shift Management
                    </li>
                   
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("applicationUser/applicationusersalarylist")}
                    >
                     Salary Management
                    </li>
                  
                  </ul>
                </li>
              
              
   
  </React.Fragment>
 )}



















     {(userData.role === SD_Roles.SuperAdmin) && (
     <React.Fragment>
    <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Settings
                  </a>
                  <ul className="dropdown-menu">
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("department/departmentList")}
                    >
                     Department Management
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("desgnation/desgnationList")}
                    >
                      Desgnation Management
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("leave/leaveList")}
                    >
                      Leave Management
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("shift/shiftList")}
                    >
                      Shifts Management
                    </li>

                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("workingDay/workingDayList")}
                    >
                      Working day Management
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("holiday/holidayList")}
                    >
                      Holiday Management
                    </li>
                  </ul>
                </li>
              
              
   
  </React.Fragment>
 )}

{(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN) && (
<Dropdown>
<Dropdown.Toggle 
    variant="primary" 
    id="dropdown-basic"
    className="btn btn-primary btn-outlined rounded-pill text-white mx-2"
    style={{
      border: "none",
      height: "40px",
      width: "100px",
      marginTop: "-1%"
    }}
  >
    Chat 
  </Dropdown.Toggle>

      <Dropdown.Menu>
        {(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN || userData.role === SD_Roles.SuperAdmin) && (
          <React.Fragment>
 <Dropdown.Item as="span">
              <NavLink
                className="btn btn-primary btn-outlined rounded-pill text-white"
                to="/chatt"
                style={{ display: 'block', width: '100%' }}
              >
                Chat
              </NavLink>
            </Dropdown.Item>

            <Dropdown.Item as="span">
              <NavLink
                className="btn btn-primary btn-outlined rounded-pill text-white"
                to="/chat"
                style={{ display: 'block', width: '100%' }}
              >
                Group Chat
              </NavLink>
            </Dropdown.Item>


           
          </React.Fragment>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )}
{(userData.role === SD_Roles.SuperAdmin) && (
  <React.Fragment>
              <li className="nav-item">
              <NavLink
                className="btn btn-primary btn-outlined rounded-pill text-white mx-2"
                style={{
                  border: "none",
                  height: "40px",
                  width: "100px",
                }}
                to="/chat"  // Add this line to redirect to video call page
              >
                Chat
              </NavLink>
            </li>
              </React.Fragment>
              )}

    {(userData.role === SD_Roles.Employee || userData.role === SD_Roles.ADMIN || userData.role === SD_Roles.SuperAdmin) && (
  <React.Fragment>
              <li className="nav-item">
              <NavLink
                className="btn btn-primary btn-outlined rounded-pill text-white mx-2"
                style={{
                  border: "none",
                  height: "40px",
                  width: "100px",
                }}
                to="/videoCall"  // Add this line to redirect to video call page
              >
                Video Call
              </NavLink>
            </li>
              </React.Fragment>
              )}

              <div className="d-flex" style={{ marginLeft: "auto" }}>
                {userData.id && (
                  <>
 
  {/* Add Chat link here */}
   
              {/* End of Chat link */}
    


                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          border: 0,
                        }}
                      >
                        Welcome, {userData.fullName}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}

                {!userData.id && (
                  <>
              
                    <li className="nav-item text-white">
                      <NavLink
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        to="/login"
                      >
                        Login
                      </NavLink>
                    </li>
                  </>
                )}




              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
