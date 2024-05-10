export default interface leaveModel {
  id: number;
  userId: string;
  user?: any;
  shiftId: number;
  shift?: any;
  date: string;
  shiftDateFrom: string;
  shiftDateTo: string;
  comment: string;
  status: string;
  approvedBy: string;
  name: string;
  userName: string;
  shiftName: string;
  }