"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { decode } from "jsonwebtoken";
import { userService } from "../api/userService";
import type { AdminPermissionName } from "../constants/permissions";
import { getCSRFToken } from "../utils/cookies.utils";

interface JwtPayload {
  userData: {
    id: number;
    email: string;
    username: string;
    plan?: number;
  };
  iat: number;
  exp: number;
}

interface AuthContextType {
  userId: number | null;
  username: string | null;
  userEmail: string | null;
  userPlan: number | null;
  userPermissions: string[];
  isPermissionsLoading: boolean;
  setUserId: (id: number | null) => void;
  setUsername: (username: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setUserPlan: (plan: number | null) => void;
  refreshUserPermissions: () => Promise<void>;
  hasPermission: (permission: AdminPermissionName) => boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<number | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(false);

  const clearAuthState = useCallback(() => {
    setUserId(null);
    setUsername(null);
    setUserEmail(null);
    setUserPlan(null);
    setUserPermissions([]);
  }, []);

  const loadUserPermissions = useCallback(async (id: number) => {
    setIsPermissionsLoading(true);
    try {
      const user = await userService.getUserById(id);
      const permissionNames = Array.isArray(user?.permissions)
        ? user.permissions
            .map((permission) => permission.name)
            .filter((permissionName): permissionName is string =>
              Boolean(permissionName),
            )
        : [];

      setUserPermissions(permissionNames);
    } catch (error) {
      console.error("Error al cargar permisos del usuario:", error);
      setUserPermissions([]);
    } finally {
      setIsPermissionsLoading(false);
    }
  }, []);

  const hydrateUserFromToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = getCSRFToken();
      if (!token) {
        clearAuthState();
        return false;
      }

      const decoded = decode(token) as JwtPayload | null;
      if (!decoded?.userData?.id || !decoded?.exp) {
        clearAuthState();
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp > currentTime;

      if (!isValid) {
        clearAuthState();
        return false;
      }

      const { id, username, email, plan } = decoded.userData;
      setUserId(id);
      setUsername(username);
      setUserEmail(email);
      setUserPlan(plan ?? null);
      await loadUserPermissions(id);

      return true;
    } catch (error) {
      console.error("Error al verificar autenticacion:", error);
      clearAuthState();
      return false;
    }
  }, [clearAuthState, loadUserPermissions]);

  useEffect(() => {
    const loadUserFromToken = async () => {
      await hydrateUserFromToken();
    };

    void loadUserFromToken();

    const interval = setInterval(() => {
      void loadUserFromToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [hydrateUserFromToken]);

  const handleSetUserId = useCallback((id: number | null) => {
    setUserId(id);
  }, []);

  const refreshUserPermissions = useCallback(async () => {
    if (!userId) {
      setUserPermissions([]);
      return;
    }

    await loadUserPermissions(userId);
  }, [loadUserPermissions, userId]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    return hydrateUserFromToken();
  }, [hydrateUserFromToken]);

  const hasPermission = useCallback(
    (permission: AdminPermissionName) => userPermissions.includes(permission),
    [userPermissions],
  );

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        userEmail,
        userPlan,
        userPermissions,
        isPermissionsLoading,
        setUserId: handleSetUserId,
        setUsername,
        setUserEmail,
        setUserPlan,
        refreshUserPermissions,
        hasPermission,
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
