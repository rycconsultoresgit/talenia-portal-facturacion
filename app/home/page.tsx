"use client";

import MainContainer from "../components/Common/MainContainer";
import MainFooter from "../components/Common/MainFooter";
import BackgroundImage from "../components/Common/BackgroundImage";
import Image from "next/image";
import main_bg from "./../assets/main_container_bg.png";
import { useDisclosure } from "@heroui/react";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { BiMenu } from "react-icons/bi";
import BillingView from "../components/Billing/BillingView";
import logo from "../assets/logo_white.webp";
import Sidebar, { type AdminView } from "../components/Billing/Sidebar";
import UsersView from "../components/Billing/UsersView";
import { useEffect, useMemo, useState } from "react";
import RolesView from "../components/Billing/RolesView";
import PlansView from "../components/Billing/PlansView";
import { ADMIN_PERMISSIONS } from "../constants/permissions";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  useAuthCheck("/");
  const { isOpen, onOpenChange } = useDisclosure();
  const { hasPermission, isPermissionsLoading } = useAuth();

  const availableViews = useMemo<AdminView[]>(
    () => [
      ...(hasPermission(ADMIN_PERMISSIONS.BILLING) ? ["billings" as const] : []),
      ...(hasPermission(ADMIN_PERMISSIONS.MANAGE_USERS) ? ["users" as const] : []),
      ...(hasPermission(ADMIN_PERMISSIONS.MANAGE_ROLES_PERMISSIONS)
        ? ["roles" as const]
        : []),
      ...(hasPermission(ADMIN_PERMISSIONS.MANAGE_PLANS) ? ["plans" as const] : []),
    ],
    [hasPermission],
  );

  const [currentView, setCurrentView] = useState<AdminView | null>(null);

  useEffect(() => {
    if (isPermissionsLoading) {
      return;
    }

    if (!currentView || !availableViews.includes(currentView)) {
      setCurrentView(availableViews[0] ?? null);
    }
  }, [availableViews, currentView, isPermissionsLoading]);

  const changeView = (view: AdminView) => {
    if (availableViews.includes(view)) {
      setCurrentView(view);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "billings":
        return <BillingView />;
      case "users":
        return <UsersView />;
      case "roles":
        return <RolesView />;
      case "plans":
        return <PlansView />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden ">
      <BackgroundImage isLoginPage={false} />
      <Sidebar
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        changeView={changeView}
        currentView={currentView}
      />

      <MainContainer src={main_bg} isLoginPage={false}>
        <div className="z-20 flex w-full flex-col items-center justify-between text-darkPurple">
          <div className="flex h-[60px] w-full items-center gap-5 rounded-lg bg-[#251D3FCC] px-5">
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                onOpenChange();
              }}
            >
              <BiMenu color="white" size={20} />
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                if (availableViews[0]) {
                  changeView(availableViews[0]);
                }
              }}
            >
              <Image width={63} height={16} alt="" src={logo} />
            </div>
          </div>

          {!isPermissionsLoading && availableViews.length > 0 && renderCurrentView()}
          {!isPermissionsLoading && availableViews.length === 0 && (
            <div className="flex h-[633px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#E9E3FF80] to-[#D9CEFF80] px-5 py-4">
              <div className="rounded-[10px] bg-[#FFFFFF66] px-8 py-6 text-center text-[#645790]">
                No tienes permisos asignados para acceder a modulos del portal.
              </div>
            </div>
          )}
          <MainFooter />
        </div>
      </MainContainer>
    </div>
  );
};

export default Home;
