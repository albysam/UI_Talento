import React, { useEffect, useState, useRef } from "react";
import {
  useCreateApplicationUserMutation,
  useGetApplicationUserByIdQuery,
  useUpdateApplicationUserMutation,
  useGetDesgnationsListQuery,
  
} from "../../Apis/applicationUserApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { applicationUserModel, desgnationModel } from "../../Interfaces";
import { SD_EmpType, SD_Gender, SD_Roles } from "../../Utility/SD";
import { useGetDepartmentsListQuery, useGetDesgnationstypeListQuery, useGetShiftsListQuery } from "../../Apis/desgnationApi";
import shiftModel from "../../Interfaces/shiftModel";
const applicationUserData = {
  name: "",
  email: "",
  phoneNumber: "",
  gender: "",
  personalIdentityNumber: "",
  department: 0,
  desgnation: 0,
  employmentType: "",
  dateOfJoining: new Date(),
  dateOfLeaving: new Date(),
  monthlySalary: "",
  overtime_hourly_Salary: "",
  employeeId: "",
  notes: "",
  roles: "",
  passwordHash: "", 
  shift: 0,
};
interface ApiError {
  status: number;
  data: {
      ErrorMessages: string[];
  };
}
function ApplicationUserUpsertAdmin() {
   
   const loggedInUser: applicationUserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const { id } = useParams();
 
  const navigate = useNavigate();
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [applicationUserInputs, setApplicationUserInputs] = useState(applicationUserData);
  const [loading, setLoading] = useState(false);
  const [createApplicationUser] = useCreateApplicationUserMutation();
  const [updateApplicationUser] = useUpdateApplicationUserMutation();
  const { data } = useGetApplicationUserByIdQuery(id);
  const { data: departmentsData } = useGetDepartmentsListQuery({});
  const { data: shiftsData } = useGetShiftsListQuery({});
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [error, setError] = useState(""); // State to store the error message
  const employeeIdRef = useRef<HTMLInputElement>(null); // Properly typed ref for the Employee ID input

  const handleShiftChange = (e: { target: { value: string; }; }) => {
    const selectedShiftId = parseInt(e.target.value, 10);
    setSelectedShift(selectedShiftId);
    
    setApplicationUserInputs(prevState => ({
      ...prevState,
      shift: selectedShiftId,
    }));
  };
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
 
  
 
  const {
    data: desgnationsData,
    refetch: refetchDesgnations,
  } = useGetDesgnationstypeListQuery(selectedDepartment);

  const handleDepartmentChange = (e: { target: { value: string; }; }) => {
    const selectedDepartmentId = parseInt(e.target.value, 10);
    setSelectedDepartment(selectedDepartmentId); 
    
    setApplicationUserInputs({
      ...applicationUserInputs,
      department: selectedDepartmentId, 
      desgnation: 0, 
    });
  };
  const [selectedDesignation, setSelectedDesignation] = useState<number | null>(
    null
  );
  
  const handleDesgnationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDesgnationId = parseInt(e.target.value, 10);
    setApplicationUserInputs(prevState => ({
      ...prevState,
      desgnation: selectedDesgnationId,
    }));
  };
  

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        name: data.result.name,
       
        email: data.result.email,
        phoneNumber: data.result.phoneNumber,
        gender: data.result.gender,
        personalIdentityNumber: data.result.personalIdentityNumber, 
        department: data.result.department,
        desgnation: data.result.desgnation,
        employmentType: data.result.employmentType,
        roles: data.result.roles,
       
        dateOfJoining: data.result.dateOfJoining === '0001-01-01T00:00:00' ? new Date() : new Date(data.result.dateOfJoining),
      
        dateOfLeaving: data.result.dateOfLeaving,
 
      
 
        monthlySalary: data.result.monthlySalary,
  overtime_hourly_Salary: data.result.overtime_hourly_Salary,
  employeeId: data.result.employeeId,
  notes: data.result.notes,

  passwordHash: data.result.passwordHash,
  shift: data.result.shift,
  
      };
      setApplicationUserInputs(tempData);
      setSelectedDepartment(data.result.department); 
      setSelectedDesignation(data.result.desgnation); 
      setImageToDisplay(data.result.image);
      console.log("Image to display:", data.result.image);
    }
  }, [data]);

  const handleApplicationUserInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, applicationUserInputs);
    setApplicationUserInputs(tempData);
  };
  

  

  

  const [dateOfJoining, setDateOfJoining] = useState<Date>(new Date()); 
  const [dateOfLeaving, setDateOfLeaving] = useState<Date>(new Date());
  
  const handleDateChange = (date: Date) => {
    setDateOfJoining(date);
    setApplicationUserInputs({
      ...applicationUserInputs,
      dateOfJoining: date,
    });

   


  };

  const handleDateChange1 = (date: Date) => {
   

    setDateOfLeaving(date);
    setApplicationUserInputs({
      ...applicationUserInputs,
      dateOfLeaving: date,
    });


  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File Must be less then 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File Must be in jpeg, jpg or png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    if (!imageToStore && !id) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }
  
   
      formData.append("PasswordHash", applicationUserInputs.passwordHash);
   
    formData.append("Name", applicationUserInputs.name);
    formData.append("Email", applicationUserInputs.email);
    formData.append("PhoneNumber", applicationUserInputs.phoneNumber);
    formData.append("Gender", applicationUserInputs.gender);
    formData.append("PersonalIdentityNumber", applicationUserInputs.personalIdentityNumber);
    formData.append("department", applicationUserInputs.department as unknown as string | Blob);

    formData.append("desgnation", applicationUserInputs.desgnation as unknown as string | Blob);
    formData.append("EmploymentType", applicationUserInputs.employmentType);

    const formattedDateOfJoining = format(applicationUserInputs.dateOfJoining, 'yyyy-MM-dd');
    formData.append("DateOfJoining", formattedDateOfJoining);

    const formattedDateOfLeaving = format(applicationUserInputs.dateOfLeaving, 'yyyy-MM-dd');
    formData.append("DateOfLeaving", formattedDateOfLeaving);
   
    formData.append("MonthlySalary", applicationUserInputs.monthlySalary);
    formData.append("Overtime_hourly_Salary", applicationUserInputs.overtime_hourly_Salary);
   
    formData.append("Notes", applicationUserInputs.notes);

    formData.append("Roles", applicationUserInputs.roles);
    formData.append("EmployeeId", applicationUserInputs.employeeId);
    formData.append("shift", applicationUserInputs.shift as unknown as string | Blob);
    
    if (imageToDisplay) formData.append("File", imageToStore);

    let response;

    try {
      let response;
      if (id) {
          formData.append("Id", id);
          response = await updateApplicationUser({ data: formData, id }).unwrap();
          toastNotify("Updated successfully", "success");
      } else {
          response = await createApplicationUser(formData).unwrap();
          toastNotify("Created successfully", "success");
      }
      navigate("/applicationUser/applicationuserlist");
  } catch (error) {
      console.error("API Error:", error);
      if (typeof error === 'object' && error !== null && 'data' in error) {
          const typedError = error as ApiError;
          if (typedError.data?.ErrorMessages?.includes("This Employee ID already exists.")) {
              setError("Employee ID already exists. Please use a different ID.");
              employeeIdRef.current?.scrollIntoView({ behavior: "smooth" });
              employeeIdRef.current?.focus();
          } else {
              const errorMessage = typedError.data?.ErrorMessages.join(", ") || "An unexpected error occurred. Please try again.";
              toastNotify(errorMessage, "error");
          }
      } else {
          toastNotify("An unexpected error occurred. Please check your network connection.", "error");
      }
  } finally {
      setLoading(false);
  }
};

  const [filteredDesgnations, setFilteredDesgnations] = useState<desgnationModel[]>([]);


  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDepartmentId = parseInt(e.target.value, 10);
  
    // Filter designations based on the selected department
    const filteredDesgnations = desgnationsData?.result.filter(
      (desgnation: desgnationModel) => desgnation.departmentId === selectedDepartmentId
    ) || [];
  
    setFilteredDesgnations(filteredDesgnations);
  
    setApplicationUserInputs({
      ...applicationUserInputs,
      department: selectedDepartmentId,
      desgnation: 0, // Reset the designation when the department changes
    });
  };
  
  
  
  
 
  




  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-success">
  {loggedInUser.id && loggedInUser.id === id ? (
    "Profile"
  ) : (
    "Edit Employee Details"
  )}
</h3>

     
<form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
  <div className="row mt-3">
    <div className="col-md-7">
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            required
            name="name"
            value={applicationUserInputs.name}
            onChange={handleApplicationUserInput}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="email">Email Id:</label>
          <input
          readOnly
            className="form-control"
            required
            name="email"
            value={applicationUserInputs.email}
            onChange={handleApplicationUserInput}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            className="form-control"
           
            name="phoneNumber"
            value={applicationUserInputs.phoneNumber === "null" ? "" : applicationUserInputs.phoneNumber}
            onChange={handleApplicationUserInput}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="gender">Gender:</label>
          <select
            className="form-control form-select"
           
            name="gender"
            value={applicationUserInputs.gender}
            onChange={handleApplicationUserInput}
          >
            <option value="">--Select Gender--</option>
            <option value={`${SD_Gender.MALE}`}>Male</option>
            <option value={`${SD_Gender.FEMALE}`}>Female</option>
          </select>
        </div>
      </div>
      <div className="row mt-3">
      <div className="col-md-6">
      <label htmlFor="personalIdentityNumber">Personal Identity Number:</label>
      <input
        className="form-control"
        
        name="personalIdentityNumber"
        value={applicationUserInputs.personalIdentityNumber === "null" ? "" : applicationUserInputs.personalIdentityNumber}

        onChange={handleApplicationUserInput}
      />
</div>
<div className="col-md-6">
                        <label htmlFor="employeeId">Employee Id:</label>
                        <input
                            type="text"
                            id="employeeId"
                            className={`form-control ${error ? "is-invalid" : ""}`}
                            required
                            name="employeeId"
                            value={applicationUserInputs.employeeId}
                            onChange={handleApplicationUserInput}
                            ref={employeeIdRef}
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
</div>
      <div className="row mt-3">
        <div className="col-md-6">
        <label htmlFor="department">Department:</label>

     <select
  className="form-control"
  
  id="department"
  name="department"
  value={applicationUserInputs.department}
  onChange={handleDepartmentChange}
>
  <option value="">Select a Department</option>
  {departmentsData?.result.map((department: desgnationModel) => (
    <option key={department.departmentId} value={department.departmentId}>
      {department.departmentName}
    </option>
  ))}
</select>



        </div>

        <div className="col-md-6">
  <label htmlFor="designation">Designation:</label>
  <select
  className="form-control"
  id="designation"
  name="designation"
  value={applicationUserInputs.desgnation} 
  onChange={handleDesgnationSelect}
>
  <option value="">Select a Designation</option>
  {desgnationsData?.result.map((designation: desgnationModel) => (
  <option key={designation.desgnationId} value={designation.desgnationId}>
    {designation.desgnationName}
  </option>
))}
</select>


</div>




      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="employmentType">Employment Type:</label>
          <select
            className="form-control form-select"
            required
            name="employmentType"
            value={applicationUserInputs.employmentType}
            onChange={handleApplicationUserInput}
          >
            <option value="">--Select Employment Type--</option>
            <option value={`${SD_EmpType.Permanent}`}>Permanent</option>
            <option value={`${SD_EmpType.Temporary}`}>Temporary</option>
          </select>
        </div>

        <div className="col-md-6">
        <label htmlFor="roles">Role:</label>
        <select
              className="form-control form-select"
              required
              value={applicationUserInputs.roles}
              name="roles"
              onChange={handleApplicationUserInput}
            >
              <option value="">--Select Role--</option>
              <option value={`${SD_Roles.Employee}`}>Employee</option>
              <option value={`${SD_Roles.ADMIN}`}>Admin</option>
            </select>
            </div>
</div>

<div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="dateOfJoining">Date Of Joining:</label>
          <DatePicker 
          
  className="custom-date-picker-style form-control"
  required
  name="dateOfJoining"
  
  selected={
    applicationUserInputs.dateOfJoining instanceof Date
      ? applicationUserInputs.dateOfJoining
      : new Date(applicationUserInputs.dateOfJoining) // Parse the stored date string to a Date object
  }
  onChange={(date) => handleDateChange(date as Date)}
/>

        </div>
        <div className="col-md-6">
          <label htmlFor="dateOfLeaving">Date Of Leaving:</label>
          <DatePicker
  className="form-control"
  name="dateOfLeaving"
  selected={
    applicationUserInputs.dateOfLeaving instanceof Date
      ? applicationUserInputs.dateOfLeaving
      : applicationUserInputs.dateOfLeaving === '0001-01-01T00:00:00'
      ? null
      : new Date(applicationUserInputs.dateOfLeaving)
  }
  onChange={(date) => handleDateChange1(date as Date)}
/>
         
        </div>


      </div>

      <div className="row mt-3">
       

        <div className="col-md-6">
          <label htmlFor="monthlySalary">Monthly Salary:</label>
          <input
            className="form-control"
            required
            name="monthlySalary"
            value={applicationUserInputs.monthlySalary}
            onChange={handleApplicationUserInput}
          />
        </div>
        <div className="col-md-6">
        <label htmlFor="overtime_hourly_Salary">Overtime Hourly Salary:</label>
      <input
        className="form-control"
        required
        name="overtime_hourly_Salary"
        value={applicationUserInputs.overtime_hourly_Salary}
        onChange={handleApplicationUserInput}
      />
</div>
      </div>

      <div className="row mt-3">
  
        <div className="col-md-12">
      <label htmlFor="notes">Notes:</label>
      <textarea
  className="form-control"
  required
  name="notes"
  value={applicationUserInputs.notes === "null" ? "" : applicationUserInputs.notes}
  onChange={handleApplicationUserInput}
></textarea>
</div>
</div>

    <input
      type="password"
      className="form-control"
      hidden
      name="passwordHash"
      value={applicationUserInputs.passwordHash}
      onChange={handleApplicationUserInput}
    />
   
     


      <div className="row mt-3">
        <div className="col-6">
          <button
            type="submit"
            className="btn btn-success form-control"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
        <div className="col-6">
          {loggedInUser.id != id && (
            <button
              type="button"
              onClick={() => navigate("/applicationUser/applicationuserlist")}
              className="btn btn-secondary form-control"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="col-md-5 text-center">
  <img
    src={imageToDisplay}
    style={{ width: "100%", borderRadius: "30px" }}
    alt=""
   
  />
  <input
    type="file"
    onChange={handleFileChange}
    className="form-control mt-3"  
  />
</div>


   
   
  </div>
</form>


    </div>
  );
}

export default ApplicationUserUpsertAdmin;


function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

