import React, { useState, ChangeEvent } from "react";
import { useGetSalaryDetailsQuery } from "../../Apis/applicationUserApi";
import { MainLoader } from "../../Components/Page/Common";
import '../../Pages/SalaryListStyles.css'; 

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ApplicationUsersalaryList() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  
  const { data, isLoading, error } = useGetSalaryDetailsQuery({ search, year, month });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonth(monthNames.indexOf(e.target.value) + 1);
  };

  const calculateTotalSalary = (salary: { id?: React.Key | null | undefined; employeeId?: any; name?: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; email?: string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; monthlySalary: any; overtimeHourlySalary: any; totalUserOvertimes: any; }) => {
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
  
  const showTable = data && data.length > 0 && year >= 2024;
  const showMessage = !isLoading && (!data || data.length === 0 || year < 2024);

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

      {showTable ? (
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
                {data.map((salary: { id: React.Key | null | undefined; employeeId: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; email: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; monthlySalary: any; overtimeHourlySalary: any; totalUserOvertimes: any; }) => (
                  <tr key={salary.id}>
                    <td>{salary.employeeId || "N/A"}</td>
                    <td>{salary.name}</td>
                    <td>{salary.email}</td>
                    <td>{salary.monthlySalary || "N/A"}</td>
                    <td>{salary.totalUserOvertimes || "0"}</td>
                    <td>{calculateOvertimeSalary(salary.overtimeHourlySalary, salary.totalUserOvertimes)}</td>
                   
                    <td>{calculateTotalSalary(salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : showMessage && (
        <p>No results found</p>
      )}
    </>
  );
}

export default ApplicationUsersalaryList;
