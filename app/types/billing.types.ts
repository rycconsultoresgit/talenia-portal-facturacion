// Tipos para las cookies
declare global {
  interface Document {
    cookie: string;
  }
}

export interface Billing {
  used_cvs: number;
  id: number;
  user_id: number;
  detail: string;
  amount: number;
  date:Date,
  status:boolean,cvs:number
}

export interface BillingResponse {
  data: Billing[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface BillingPayDetail {
  id: string;
  transaction_type: string;
  user_id: number;
  name: string;
  price: number;
  date: string;
  status: boolean;
  cvs: number;
  user_cvs: number;
}

export interface BillingMonth {
  month: string;
  plan: number;
  extra: number;
  status: boolean;
  detail: BillingPayDetail[];
}

export interface BillingGroup {
  user: string;
  months: BillingMonth[];
}


export interface AuthResponse {
  billing: Billing;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
}


