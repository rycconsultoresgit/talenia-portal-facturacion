import { getCSRFToken } from "@/app/utils/cookies.utils";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

// Crear instancia principal de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Importante para enviar cookies
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No necesitamos agregar el token manualmente si usamos cookies HTTP-only
    // El token se enviará automáticamente con las credenciales
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.request.use((config) => {
  const token = getCSRFToken();
  if (token) {
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  },
);

// Interceptores comentados para evitar problemas de CORS
// cvProcessClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// cvProcessClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default apiClient;
