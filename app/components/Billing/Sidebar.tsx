"use client";

import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";
import React, { useMemo, useState } from "react";
import { CiMoneyCheck1, CiLock } from "react-icons/ci";
import { FiSettings } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { PiKeyLight } from "react-icons/pi";
import Image from "next/image";
import purpleLogo from "../../assets/logo_purple.png";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { userService } from "@/app/api/userService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ADMIN_PERMISSIONS } from "@/app/constants/permissions";

export type AdminView = "billings" | "users" | "roles" | "plans";

type SidebarProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  changeView?: (view: AdminView) => void;
  currentView?: AdminView | null;
};

type SidebarItem = {
  key: AdminView;
  label: string;
  icon: React.ReactNode;
};

function Sidebar({
  isOpen,
  onOpenChange,
  changeView,
  currentView,
}: SidebarProps) {
  const { username, hasPermission, isPermissionsLoading } = useAuth();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const items = useMemo<SidebarItem[]>(
    () => [
      ...(hasPermission(ADMIN_PERMISSIONS.BILLING)
        ? [
            {
              key: "billings" as const,
              label: "Facturacion",
              icon: <CiMoneyCheck1 color="darkPurple" />,
            },
          ]
        : []),
      ...(hasPermission(ADMIN_PERMISSIONS.MANAGE_USERS)
        ? [
            {
              key: "users" as const,
              label: "Usuarios",
              icon: <LuUsers color="darkPurple" />,
            },
          ]
        : []),
      ...(hasPermission(ADMIN_PERMISSIONS.MANAGE_ROLES_PERMISSIONS)
        ? [
            {
              key: "roles" as const,
              label: "Roles y permisos",
              icon: <PiKeyLight color="darkPurple" />,
            },
          ]
        : []),
      ...(hasPermission(ADMIN_PERMISSIONS.MANAGE_PLANS)
        ? [
            {
              key: "plans" as const,
              label: "Planes",
              icon: <CiLock color="darkPurple" />,
            },
          ]
        : []),
    ],
    [hasPermission],
  );

  const handleLogoutConfirmation = async () => {
    try {
      await userService.logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    }
  };

  return (
    <>
      <ConfirmationModal
        title="¿Cerrar sesion?"
        description="Tu sesion actual se cerrara y deberas volver a iniciar sesion para continuar."
        primaryLabel="Cerrar sesion"
        secondaryLabel="Cancelar"
        isOpen={isLogoutModalOpen}
        onSecondaryClick={() => setIsLogoutModalOpen(false)}
        onPrimaryClick={handleLogoutConfirmation}
      />
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        className="h-full w-[240px] overflow-hidden py-[10px]"
        motionProps={{ typeof: "overlay" }}
      >
        <DrawerContent className="h-[95%]">
          <DrawerBody className="h-[95%]">
            <DrawerContent className="bg-gradient-to-r from-[#ECF4FF] via-[#FFFFFF] to-[#EAE4FF] px-[10px] py-[10px] text-darkPurple">
              <div className="flex h-full w-full flex-col gap-4">
                <div className="flex h-[60px] w-full items-center justify-start border-b-1 px-[10px]">
                  <Image width={63} height={16} alt="" src={purpleLogo} />
                </div>
                <div className="flex h-full w-full flex-col items-start justify-between">
                  <div className="flex w-full flex-col items-start justify-center gap-4 px-[10px]">
                    {!isPermissionsLoading &&
                      items.map((item) => (
                        <div
                          key={item.key}
                          onClick={() => {
                            changeView?.(item.key);
                            onOpenChange();
                          }}
                          className={`flex h-[36px] w-full items-center gap-2 rounded-[5px] px-2 ${
                            currentView === item.key
                              ? "bg-white"
                              : "hover:cursor-pointer hover:bg-white"
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </div>
                      ))}
                  </div>

                  <div className="flex h-[60px] w-full items-center justify-center rounded-[10px] bg-[#442F8D] text-white">
                    <div
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex w-full items-center justify-between px-4"
                    >
                      <p>{username}</p>
                      <div className="hover:cursor-pointer">
                        <FiSettings />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;
