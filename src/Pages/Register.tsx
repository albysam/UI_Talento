import React, { useState } from "react";
import { useRegisterUserMutation } from "../Apis/authApi";
import { inputHelper, toastNotify } from "../Helper";
import { apiResponse, userModel } from "../Interfaces";
import { SD_Roles } from "../Utility/SD";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";

import { useSelector } from "react-redux";
import { RootState } from "../Storage/Redux/store";
function Register() {
  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: "",
    name: "",
  });
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: userInput.role,
      name: userInput.name,
    });
    if (response.data && (!userData.id)) {
      toastNotify("Registeration successful! Please login to continue.");
      navigate("/login");
    } 
   if(userData.id){
   
    toastNotify("User Created successfully");
      navigate("/applicationUser/applicationuserlist");
      window.location.reload();
   }
   
    else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
    }

    setLoading(false);
  };

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>

      <h1 className="mt-5">
        {!userData.id ? "Register" : "Create User"}
      </h1>


        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email ID"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={userInput.name}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <select
              className="form-control form-select"
              required
              value={userInput.role}
              name="role"
              onChange={handleUserInput}
            >
              <option value="">--Select Role--</option>
              
              <option value={`${SD_Roles.ADMIN}`}>Admin</option>
              <option value={`${SD_Roles.Employee}`}>Employee</option>
              
            </select>
          </div>
        </div>


        
        <div className="mt-5">
          <button type="submit" className="btn btn-success" disabled={loading}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
