export default interface ondutyModel {
  id: number;
  userId: string;
  user: User;
  workingDate: string;
  timeFrom: string;
  timeTo: string;
  workedHours: string;
  comment: string;
  status: number;
  note?: any;
  userName: string;
  name?: any;
}

export interface User {
  name: string;
  imageUrl?: any;
  image: string;
  roles: string;
  gender: string;
  personalIdentityNumber: string;
  department: number;
  desgnation: number;
  employmentType: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  monthlySalary: string;
  overtime_hourly_Salary: string;
  status: number;
  notes: string;
  createdBy?: any;
  updatedBy?: any;
  createdDate: string;
  updatedDate: string;
  employeeId: string;
  shift: number;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}