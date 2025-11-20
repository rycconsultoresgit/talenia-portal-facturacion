"use client";

/**
 * Obtiene el valor de una cookie por su nombre
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  
  const value = `; ${document.cookie}`;
  console.log(value);
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * Obtiene el token CSRF de las cookies
 */
export function getCSRFToken(): string | null {
  return getCookie("csrf");
}
