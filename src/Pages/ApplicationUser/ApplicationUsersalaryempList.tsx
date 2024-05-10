import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useGetSalaryDetailsQuery } from "../../Apis/applicationUserApi";
import { MainLoader } from "../../Components/Page/Common";
import '../../Pages/SalaryListStyles.css'; 
import { RootState } from "../../Storage/Redux/store";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ApplicationUsersalaryempList() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  
  const userData = useSelector((state: RootState) => state.userAuthStore);

  const { data, isLoading, error } = useGetSalaryDetailsQuery({
    search, 
    year, 
    month, 
    userId: userData.id 
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonth(monthNames.indexOf(e.target.value) + 1);
  };

  const calculateTotalSalary = (salary: { id?: React.Key | null | undefined; employeeId?: any; name?: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; email?: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; monthlySalary: any; totalUserOvertimes: any; overtimeHourlySalary: any; }) => {
    const monthlySalary = parseFloat(salary.monthlySalary);
    const overtimeHours = parseFloat(salary.totalUserOvertimes);
    const overtimeRate = parseFloat(salary.overtimeHourlySalary);
    return salary.totalUserOvertimes && salary.overtimeHourlySalary
      ? (monthlySalary + overtimeHours * overtimeRate).toLocaleString()
      : monthlySalary.toLocaleString();
  };

  const calculateOvertimeSalary = (overtimeRate: string, overtimeHours: string) => {
    return overtimeRate && overtimeHours
      ? (parseFloat(overtimeRate) * parseFloat(overtimeHours)).toLocaleString()
      : "0";
  };

  return (
    <>
      {isLoading && <MainLoader />}
      <div className="search-filters">
        <input type="text" placeholder="Search name, email or employee ID" value={search} onChange={handleSearchChange} />
        <select value={year.toString()} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={monthNames[month - 1]} onChange={handleMonthChange}>
          {monthNames.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
      </div>
  
      {data && data.some((salary: { id: string; }) => salary.id === userData.id) ? (
        <div className="table p-5">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>Monthly Salary</th>
                  <th>Overtime Working Hours</th>
                  <th>Overtime Salary</th>
                  <th>Total Salary</th>
                </tr>
              </thead>
              <tbody>
                {data.filter((salary: { id: string; }) => salary.id === userData.id).map((userSalaryData: { id: React.Key | null | undefined; employeeId: any; name: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; email: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; monthlySalary: any; totalUserOvertimes: any; overtimeHourlySalary: any; }) => (
                  <tr key={userSalaryData.id}>
                    <td>{userSalaryData.employeeId || "N/A"}</td>
                    <td>{userSalaryData.name}</td>
                    <td>{userSalaryData.email}</td>
                    <td>{userSalaryData.monthlySalary || "N/A"}</td>
                    <td>{userSalaryData.totalUserOvertimes || "0"}</td>
                    <td>{calculateOvertimeSalary(userSalaryData.overtimeHourlySalary, userSalaryData.totalUserOvertimes)}</td>
                    <td>{calculateTotalSalary(userSalaryData)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No results found</p>
      )}
    </>
  );
}

export default ApplicationUsersalaryempList;
