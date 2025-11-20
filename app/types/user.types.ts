// Tipos para las cookies
declare global {
  interface Document {
    cookie: string;
  }
}

export interface User {
  id: number;
  username: string;
  email: string;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  data: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  status?: number;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  status?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UpdatePasswordDto {
  userId: number;
  currentPassword: string;
  newPassword: string;
}
