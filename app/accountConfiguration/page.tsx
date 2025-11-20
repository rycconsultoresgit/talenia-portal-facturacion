"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthCheck } from "../hooks/useAuthCheck";
import BackgroundImage from "../components/Common/BackgroundImage";
import DrawerMenu from "../components/Drawer/DrawerMenu";
import MainContainer from "../components/Common/MainContainer";
import ConfigSection from "../components/AccConfig/ConfigSection";

import config_bg from "./../assets/config_container_bg.png";
import TaleniaNavbar from "../components/Common/TaleniaNavbar";
import MainFooter from "../components/Common/MainFooter";

const AccountConfiguration = () => {
  // Verificar autenticación al cargar la página
  useAuthCheck("/");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/home");
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden">
      <BackgroundImage isLoginPage={false} />

      {/* Drawer Menu - renderizado globalmente */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />

      <MainContainer src={config_bg} isLoginPage={false}>
        <div className="z-10 flex h-full w-full flex-col">
          <div className="flex h-full flex-col">
            <TaleniaNavbar
              isDrawerOpen={isDrawerOpen}
              onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            />

            <ConfigSection onGoBack={handleGoBack} />

            <MainFooter />
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default AccountConfiguration;
