import {
  AuthResponse,
  CreateUserDto,
  LoginDto,
  RefreshResponse,
  UpdatePasswordDto,
  UpdateUserDto,
  User,
} from "../types/user.types";
import apiClient from "./config/api-config.api";

type ClientPayload = {
  username: string;
  password: string;
  email: string;
  rut: string;
  dv: string;
  company: number;
  plan: string;
  role: string;
};

type UpdateClientPayload = Partial<ClientPayload>;

type RolePayload = {
  name?: string;
  description?: string;
  permisses?: string;
};

const registerUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await apiClient.post("/users", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      status: 1, // Por defecto activo
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      message: string;
      response?: {
        data?: unknown;
        status?: number;
      };
    };
    console.error("Error al registrar usuario:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw error;
  }
};

const loginUser = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post("/users/manager/login", credentials, {
    withCredentials: true,
  });
  return response.data;
};

// Logout
const logout = async (): Promise<{ success: boolean }> => {
  try {
    await apiClient.post(
      "/users/logout",
      {},
      {
        withCredentials: true,
      },
    );

    // Limpiar cookies de autenticación
    document.cookie =
      "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    return { success: true };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // Limpiar cookies aunque falle la petición
    document.cookie =
      "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    return { success: true };
  }
};

// Refrescar token
const refreshToken = async (): Promise<RefreshResponse> => {
  try {
    const response = await apiClient.post(
      "/users/refresh-token",
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
};

// Actualizar contraseña
const updatePassword = async (
  data: UpdatePasswordDto,
): Promise<{ message: string }> => {
  try {
    const response = await apiClient.patch("/users/password/update", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };
    const errorMessage =
      axiosError.response?.data?.message || "Error al actualizar la contraseña";
    console.error("Error al actualizar la contraseña:", error);
    throw new Error(errorMessage);
  }
};

// Actualizar usuario
const updateUser = async (
  id: number,
  userData: UpdateUserDto,
): Promise<User> => {
  try {
    const response = await apiClient.patch(`/users/update/${id}`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      message: string;
      response?: {
        data?: unknown;
        status?: number;
      };
    };
    console.error("Error al actualizar usuario:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw error;
  }
};

// Eliminar usuario
const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/delete/${id}`, {
      withCredentials: true,
    });
  } catch (error: unknown) {
    const axiosError = error as {
      message: string;
      response?: {
        data?: unknown;
        status?: number;
      };
    };
    console.error("Error al eliminar usuario:", {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw error;
  }
};

//Traer a los usuarios
const getAllUsers = async (params: { page: number; limit: number }) => {
  try {
    const users = await apiClient.post("/users/all", { params: params });
    return users.data;
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (id: number) => {
  try {
    const response = await apiClient.get(`/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllRoles = async () => {
  try {
    const users = await apiClient.get("/roles/all", {
      withCredentials: true,
    });
    return users.data;
  } catch (error) {
    console.log(error);
  }
};

const createRole = async (data: RolePayload) => {
  try {
    const role = await apiClient.post("/roles", data);
    return role.data;
  } catch (error) {
    throw error;
  }
};

const deleteRole = async (id: number) => {
  try {
    const role = await apiClient.delete(`/roles/${id}`);
    return role.data;
  } catch (error) {
    throw error;
  }
};

const createNewClient = async (data: ClientPayload) => {
  try {
    const res = await apiClient.post("/users", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const updateInfoClient = async (id: number, data: UpdateClientPayload) => {
  try {
    const res = await apiClient.patch(`/users/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const updateInfoRole = async (id: number, data: RolePayload) => {
  try {
    const res = await apiClient.patch(`/roles/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllCompanies = async () => {
  try {
    const res = await apiClient.get('/companies')
    if(res){
      return res.data
    }
    
  } catch (error) {
    console.log("Error al traer las compañias: ", error);
  }
}

const assignPermissions = async (userId: number, permissionIds: number[]) => {
  const response = await apiClient.post(
    `/users/${userId}/permissions/assign`,
    { permissionIds },
    { withCredentials: true },
  );
  return response.data;
};

export const userService = {
  registerUser,
  loginUser,
  logout,
  refreshToken,
  updatePassword,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getAllRoles,
  createNewClient,
  createRole,
  deleteRole,
  updateInfoClient,
  updateInfoRole,getAllCompanies,
  assignPermissions
};
