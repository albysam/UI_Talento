export default interface leaveModel {
  id: number;
  leaveId: number;
  userId: string;
  name: string;
  userName: string;
  leaveName: string;
  leaveDays: string;
  approvedStatus?: any;
  comment: string;
  status: number;
  type: string;
  dateFrom: string;
  dateTo: string;
  reason: string;
  
  }