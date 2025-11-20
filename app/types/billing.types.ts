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


