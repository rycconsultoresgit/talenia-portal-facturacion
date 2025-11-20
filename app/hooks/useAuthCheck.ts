"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

/**
 * Hook que verifica la autenticación del usuario
 * @param redirectTo - Ruta a la que redirigir si el usuario no está autenticado (opcional)
 */
export function useAuthCheck(redirectTo?: string) {
  const { checkAuth, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar la autenticación cuando el componente se monta
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();

        // Redirigir si no está autenticado y se especificó una ruta de redirección
        if (!isAuth && redirectTo) {
          router.push(redirectTo);
        }

        return isAuth;
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        if (redirectTo) {
          router.push(redirectTo);
        }
        return false;
      }
    };

    verifyAuth();

    // Opcional: Verificar periódicamente la validez del token
    const interval = setInterval(verifyAuth, 5 * 60 * 1000); // Cada 5 minutos

    return () => clearInterval(interval);
  }, [checkAuth, redirectTo, router]);

  return userId !== null;
}
