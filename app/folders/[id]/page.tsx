"use client";

import { useState, useRef } from "react";
import MainContainer from "../../components/Common/MainContainer";
import MainFooter from "../../components/Common/MainFooter";
import BackgroundImage from "../../components/Common/BackgroundImage";
import DrawerMenu from "../../components/Drawer/DrawerMenu";
import NewAnalysisModal from "../../components/Modals/NewAnalysisModal";

import { useAuthCheck } from "../../hooks/useAuthCheck";
import { useParams, useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

import main_bg from "./../../assets/main_container_bg.png";
import ProjectSection from "@/app/components/Project/ProjectSection";
import TaleniaNavbar from "@/app/components/Common/TaleniaNavbar";
const FolderDetails = () => {
  useAuthCheck("/");

  const router = useRouter();

  const params = useParams();
  const folderId = params.id as string;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const refreshProjectsRef = useRef<(() => void) | null>(null);

  const {
    isOpen: isOpenNewAnalysis,
    onOpen: onOpenNewAnalysis,
    onOpenChange: onOpenChangeNewAnalysis,
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

            <ProjectSection
              folderId={folderId}
              onNewAnalysis={onOpenNewAnalysis}
              onGoBack={() => router.push(`/home`)}
              refreshProjects={(refreshFn) => {
                refreshProjectsRef.current = refreshFn;
              }}
            />

            {/* Footer */}
            <MainFooter />
          </div>
        </div>
      </MainContainer>

      <NewAnalysisModal
        folderId={folderId}
        isOpen={isOpenNewAnalysis}
        onClose={() => onOpenChangeNewAnalysis()}
        onProjectCreated={() => {
          if (refreshProjectsRef.current) {
            refreshProjectsRef.current();
          }
        }}
      />
    </div>
  );
};

export default FolderDetails;
