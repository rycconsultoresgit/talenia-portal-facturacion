import axios from "axios";

// Crear instancia separada para el servicio de procesamiento de CV
const CV_PROCESS_URL = process.env.NEXT_PUBLIC_CV_PROCESS_URL;

export const cvProcessClient = axios.create({
  baseURL: CV_PROCESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Deshabilitado para evitar CORS
});
