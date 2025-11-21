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
  const response = await apiClient.post("/users/login", credentials, {
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
const getAllUsers = async () => {
  try {
    return [
      {
        nombre: "Nicolás Cruz",
        rut: "20249567-2",
        email: "nickocruz4513@gmail.com",
        empresa: "RyC Consultores",
        plan: "Plan Anual",
        rol: "Cliente",
      },
      {
        nombre: "Nicolás Cruz",
        rut: "20249567-2",
        email: "nickocruz4513@gmail.com",
        empresa: "RyC Consultores",
        plan: "Plan Anual",
        rol: "Cliente",
      },
    ];
  } catch (error) {
    console.log(error);
  }
};

export const userService = {
  registerUser,
  loginUser,
  logout,
  refreshToken,
  updatePassword,
  updateUser,
  deleteUser,getAllUsers
};
