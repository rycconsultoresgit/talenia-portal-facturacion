"use client";

import MainContainer from "../components/Common/MainContainer";
import MainFooter from "../components/Common/MainFooter";
import BackgroundImage from "../components/Common/BackgroundImage";
import { useRef, useState } from "react";
import DrawerMenu from "../components/Drawer/DrawerMenu";

import main_bg from "./../assets/main_container_bg.png";
import { PrimaryButton } from "../components/Common/Buttons";
import { CgExtensionAdd } from "react-icons/cg";
import { useDisclosure } from "@heroui/react";
import NewAnalysisModal from "../components/Modals/NewAnalysisModal";
import NewFolderModal from "../components/Modals/NewFolderModal";
import FolderSection from "../components/Home/FolderSection";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useAuth } from "../context/AuthContext";
import TaleniaNavbar from "../components/Common/TaleniaNavbar";

const Home = () => {
  const { userId } = useAuth();

  // Verificar autenticación al cargar la página
  useAuthCheck("/");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const folderRefreshRef = useRef<(() => void) | null>(null);

  const {
    isOpen: isOpenNewAnalysis,
    onOpen: onOpenNewAnalysis,
    onOpenChange: onOpenChangeNewAnalysis,
  } = useDisclosure();

  const {
    isOpen: isOpenNewFolder,
    onOpen: onOpenNewFolder,
    onOpenChange: onOpenChangeNewFolder,
  } = useDisclosure();

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden">
      <BackgroundImage isLoginPage={false} />

      {/* Drawer Menu - renderizado globalmente */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />

      <MainContainer src={main_bg} isLoginPage={false}>
        <div className="z-10 flex h-full w-full flex-col">
          {/* Main Content */}
          <div className="flex h-full flex-col">
            <TaleniaNavbar
              isDrawerOpen={isDrawerOpen}
              onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            />

            {/* Welcome Section - Takes available space */}
            <div className="flex w-full flex-1 flex-col items-center justify-center">
              <h1 className="text-3xl font-medium text-purple">
                ¡Bienvenido a TalenIA!
              </h1>
              <PrimaryButton
                label="Nuevo análisis"
                icon={CgExtensionAdd}
                className="mt-11"
                onClick={onOpenNewAnalysis}
              />
            </div>

            {/* Folder Section - Fixed height */}
            <FolderSection
              userId={userId}
              onOpenNewFolder={onOpenNewFolder}
              onRefreshReady={(refreshFn) => {
                folderRefreshRef.current = refreshFn;
              }}
            />

            {/* Footer */}
            <MainFooter />
          </div>
        </div>
      </MainContainer>

      <NewAnalysisModal
        folderId=""
        isHomePage
        isOpen={isOpenNewAnalysis}
        onClose={() => onOpenChangeNewAnalysis()}
        onProjectCreated={() => {
          folderRefreshRef.current?.();
        }}
      />

      <NewFolderModal
        isOpen={isOpenNewFolder}
        onClose={() => onOpenChangeNewFolder()}
        onFolderCreated={() => {
          folderRefreshRef.current?.();
        }}
      />
    </div>
  );
};

export default Home;
