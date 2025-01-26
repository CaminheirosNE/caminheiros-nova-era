export interface Member {
  id: string;
  name: string;
  gender: 'M' | 'F';
  birthDate: string;
  phone: string;
  type: 'Consulente' | 'Trabalhador';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  participants: string[]; // Array of Member IDs
  createdAt: string;
}

export interface Therapy {
  id: string;
  name: string;
  maxTickets: number;
  currentTickets: number[];
  location: string;
}

export interface TherapySession {
  id: string;
  memberId: string;
  therapyId: string;
  date: string;
  ticketNumber: number;
  called: boolean;
}

export interface MonthlyPayment {
  id: string;
  memberId: string;
  month: string;
  amount: number;
  paid: boolean;
  paymentDate?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export interface UserPrivilege {
  userId: string;
  screenId: string;
  level: 1 | 2 | 3 | 4; // 1: Admin, 2: No Access, 3: View, 4: Edit
}

export interface Alert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}