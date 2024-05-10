export default interface attendenceModel {
  id: number;
  employeeId: string;
  name: string;
  userName: string;
  clockInTime: string;
  clockOutTime: string;
  breakStartTime: string;
  breakEndTime: string;
  workingDate: string;
  workedHours: string;
  breakHours: string;
  status: number;
  shiftName: string;
  email: string; 
  totalWorkedHours: number; 
  totalWorkedMinutes: number;
  }