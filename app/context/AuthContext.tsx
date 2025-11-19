"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { decode } from "jsonwebtoken";
import { getCSRFToken } from "../utils/cookies.utils";

interface JwtPayload {
  userData: {
    id: number;
    email: string;
    username: string;
  };
  iat: number;
  exp: number;
}

interface AuthContextType {
  userId: number | null;
  username: string | null;
  userEmail: string | null;
  setUserId: (id: number | null) => void;
  setUsername: (username: string | null) => void;
  setUserEmail: (email: string | null) => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Cargar el usuario del token JWT en las cookies al iniciar
  useEffect(() => {
    const loadUserFromToken = () => {
      try {
        const token = getCSRFToken();
        if (token) {
          const decoded = decode(token) as JwtPayload;
          if (decoded?.userData?.id) {
            setUsername(decoded.userData.username);
            setUserId(decoded.userData.id);
            setUserEmail(decoded.userData.email);
            return;
          }
        }
        // Si no hay token o es inválido, limpiar el estado
        setUserId(null);
        setUsername(null);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUserId(null);
      }
    };

    // Cargar el usuario al montar el componente
    loadUserFromToken();

    // También podrías querer verificar el token periódicamente
    const interval = setInterval(loadUserFromToken, 5 * 60 * 1000); // Cada 5 minutos

    return () => clearInterval(interval);
  }, []);

  const handleSetUserId = (id: number | null) => {
    // No necesitamos guardar el ID en localStorage ya que lo obtenemos del token
    setUserId(id);
  };

  // Función para verificar si el usuario está autenticado basado en el token
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = getCSRFToken();
      if (!token) {
        setUserId(null);
        return false;
      }

      const decoded = decode(token) as JwtPayload;
      if (!decoded?.exp) {
        setUserId(null);
        return false;
      }

      // Verificar si el token ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp > currentTime;

      if (isValid && decoded.userData) {
        setUserId(decoded.userData.id);
        setUsername(decoded.userData.username);
        setUserEmail(decoded.userData.email);
      } else {
        setUserId(null);
        setUsername(null);
        setUserEmail(null);
      }

      return isValid;
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setUserId(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        userEmail,
        setUserId: handleSetUserId,
        setUsername,
        setUserEmail,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
