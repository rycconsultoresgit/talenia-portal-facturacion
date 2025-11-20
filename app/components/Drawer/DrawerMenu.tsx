"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { userService } from "@/app/api/userService";
import DrawerHeader from "./DrawerHeader";
import DrawerContent from "./DrawerContent";
import DrawerFooter from "./DrawerFooter";
import ConfirmationModal from "../Modals/ConfirmationModal";

interface DrawerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DrawerMenu({
  isOpen,
  onToggle,
}: Readonly<DrawerMenuProps>) {
  const router = useRouter();
  const { username } = useAuth();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Bloquear scroll del body cuando el drawer está abierto
  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    onToggle(); // Close the drawer
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirmation = async () => {
    try {
      await userService.logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Cerrar el drawer al hacer clic fuera de él
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const drawer = document.getElementById("drawer-panel");
      const button = document.getElementById("drawer-button");
      const target = event.target as Node;

      // Verificar si el clic fue fuera del drawer y del botón
      const clickedOutsideDrawer = drawer && !drawer.contains(target);
      const clickedOutsideButton = button && !button.contains(target);

      if (clickedOutsideDrawer && clickedOutsideButton) {
        onToggle();
      }
    };

    // Agregar el event listener al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      <ConfirmationModal
        title="¿Cerrar sesión?"
        description={
          "Tu sesión actual se cerrará y deberás volver a iniciar sesión para continuar."
        }
        primaryLabel="Cerrar sesión"
        secondaryLabel="Cancelar"
        isOpen={isLogoutModalOpen}
        onSecondaryClick={() => setIsLogoutModalOpen(false)}
        onPrimaryClick={handleLogoutConfirmation}
      />

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/25 transition-opacity duration-300 ${
          isOpen ? "z-40 opacity-100" : "pointer-events-none z-[-1] opacity-0"
        }`}
        onClick={onToggle}
      />

      {/* Panel del Drawer */}
      <div
        id="drawer-panel"
        className={`to-65%% fixed bottom-5 left-0 top-5 z-50 w-[280px] rounded-2xl bg-gradient-to-b from-drawerPrimary from-35% via-white via-50% to-drawerPrimary ring-1 ring-white transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "w-0 -translate-x-full opacity-0"
        }`}
      >
        <div className="flex h-full w-full flex-col gap-8 pt-6">
          {/* Header del Drawer */}
          <DrawerHeader onToggle={onToggle} />

          {/* Contenido del Drawer */}
          <DrawerContent isOpen={isOpen} onToggle={onToggle} />

          {/* Footer del Drawer */}
          <DrawerFooter
            username={username}
            onToggle={onToggle}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </>
  );
}
