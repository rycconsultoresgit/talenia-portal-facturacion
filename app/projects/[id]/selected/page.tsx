"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { CandidateUI } from "@/app/types/candidate.types";
import { CVEvent } from "@/app/types/sse.types";
import { convertCVToCandidate } from "@/app/utils/candidate.utils";
import { SelectionSummary } from "../../../components/Candidate/Selected/SelectionSummary";
import { CandidateStatusCards } from "../../../components/Candidate/Selected/CandidateStatusCards";
import { RecommendationType } from "@/app/utils/recommendationStyles.utils";
import { SelectedCandidateCard } from "@/app/components/Candidate/Selected/SelectedCandidateCard";
import BackgroundImage from "@/app/components/Common/BackgroundImage";
import DrawerMenu from "@/app/components/Drawer/DrawerMenu";
import MainContainer from "@/app/components/Common/MainContainer";
import main_bg from "./../../../assets/candidates_container_bg.png";
import TaleniaNavbar from "@/app/components/Common/TaleniaNavbar";
import MainFooter from "@/app/components/Common/MainFooter";
import { Button, useDisclosure } from "@heroui/react";
import { IoIosArrowBack } from "react-icons/io";
import { cvImportService } from "@/app/api/cvImportService";
import { candidateService } from "@/app/api/candidateService";
import EditableProjectName from "@/app/components/Candidate/EditableProjectName";
import ProjectInfoModal from "@/app/components/Modals/ProjectInfoModal";
import ConfirmationModal from "@/app/components/Modals/ConfirmationModal";
import { Project } from "@/app/types/project.types";
import { projectService } from "@/app/api/projectsService";
import ViewCV from "@/app/components/Drawer/ViewCV";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfContent from "@/app/components/Project/PdfContent";
import { AiOutlineFilePdf } from "react-icons/ai";

export default function SelectedCandidates() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  const numericUserId = userId ? Number(userId) : null;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [cvs, setCvs] = useState<CVEvent[]>([]);
  const [allCandidates, setAllCandidates] = useState<
    Array<CandidateUI & { recommendation?: RecommendationType }>
  >([]);
  const [selectedCvs, setSelectedCvs] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cvInView, setCvInView] = useState(null);
  const selectionSummaryRef = useRef(null);

  // Manejar intento de salida de la página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Tienes cambios sin guardar. ¿Estás seguro de querer salir?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Manejar navegación dentro de la aplicación
  useEffect(() => {
    if (pendingNavigation && !hasUnsavedChanges) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, hasUnsavedChanges, router]);

  // Manejar el botón de atrás del navegador
  useEffect(() => {
    // Variable para controlar si ya hemos manejado el popstate
    let handledPopState = false;

    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges && !handledPopState) {
        console.log(event);
        // Prevenir la navegación y mostrar el modal
        handledPopState = true;
        setShowExitModal(true);
        // Reemplazar la entrada actual en lugar de agregar una nueva
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    // Agregar el manejador de eventos
    window.addEventListener("popstate", handlePopState);

    // Agregar una entrada al historial solo si es la primera vez
    if (window.history.state === null) {
      window.history.replaceState(
        { from: "talenia-selected" },
        "",
        window.location.pathname,
      );
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleNavigation = (url: string) => {
    if (hasUnsavedChanges && url !== pathname) {
      setPendingNavigation(url);
      setShowExitModal(true);
    } else {
      router.push(url);
    }
  };

  const handleConfirmExit = useCallback(() => {
    setHasUnsavedChanges(false);
    setShowExitModal(false);

    // Usar un pequeño timeout para asegurar que el estado se actualice
    setTimeout(() => {
      if (pendingNavigation) {
        router.push(pendingNavigation);
        setPendingNavigation(null);
      } else {
        // Usar window.history.back() directamente para asegurar la navegación
        window.history.back();
      }
    }, 0);
  }, [pendingNavigation, router]);

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const fetchCVs = useCallback(async () => {
    try {
      const res = await cvImportService.getFiltredCvs(id as string, "", {
        projectId: id as string,
      });
      const data = await res.data;
      setCvs(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los candidatos");
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCVs();
    }
  }, [id, fetchCVs]);

  // Cargar datos del proyecto
  useEffect(() => {
    const loadProject = async () => {
      if (id) {
        try {
          const projectData = await projectService.getProject(id as string);
          setProject(projectData);
        } catch (err) {
          console.error("Error loading project:", err);
        }
      }
    };

    loadProject();
  }, [id]);

  useEffect(() => {
    const processedCandidates = cvs
      .map((cv) => convertCVToCandidate(cv))
      .filter((candidate): candidate is CandidateUI => candidate !== null);

    setAllCandidates(processedCandidates);

    // Actualizar selectedCvs basado en los CVs que tienen selected: true
    const currentlySelectedCvs = cvs
      .filter((cv) => cv.selected)
      .map((cv) => cv.id);

    setSelectedCvs(currentlySelectedCvs);
  }, [cvs]);

  const removeCvToSelectedCv = async (candidateId: string) => {
    try {
      // Actualizar el estado local
      setSelectedCvs((prev) => prev.filter((value) => value !== candidateId));

      // Actualizar en la base de datos
      await candidateService.updateCandidate(candidateId, {
        candidate: {
          selected: false,
        },
      });

      // Actualizar el estado del candidato en allCandidates
      setAllCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, selected: false }
            : candidate,
        ),
      );
    } catch (error) {
      // Revertir el cambio en el estado local si hay un error
      console.log(error);
      setSelectedCvs((prev) => [...prev, candidateId]);
    }
  };

  const addCvToSelectedCv = async (candidateId: string) => {
    try {
      // Actualizar el estado local
      setSelectedCvs((prev) => [...prev, candidateId]);

      // Actualizar en la base de datos
      await candidateService.updateCandidate(candidateId, {
        candidate: {
          selected: true,
        },
      });

      // Actualizar el estado del candidato en allCandidates
      setAllCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, selected: true }
            : candidate,
        ),
      );
    } catch (error) {
      // Revertir el cambio en el estado local si hay un error
      console.log(error);
      setSelectedCvs((prev) => prev.filter((value) => value !== candidateId));
    }
  };

  const handleViewCV = (candidate: CandidateUI) => {
    setCvInView(candidate);
    onOpen();
  };

 const exportSelectionSumary = async () => {
  const inputData = selectionSummaryRef.current;

  try {
    const canvas = await html2canvas(inputData, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = imgWidth / pdfWidth;
    const bottomPadding = 40;
    const pageHeightPx = pdfHeight * ratio - bottomPadding;

    let position = 0;
    let pageNumber = 1;

    while (position < imgHeight) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidth;
      pageCanvas.height = pageHeightPx;

      const ctx = pageCanvas.getContext("2d");

      ctx.drawImage(
        canvas,
        0,
        position,
        imgWidth,
        pageHeightPx,
        0,
        0,
        imgWidth,
        pageHeightPx
      );

      const pageImg = pageCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(pageImg, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20 - bottomPadding);
      pdf.setFontSize(12);
      pdf.text(
        ` ${pageNumber}`,
        pdfWidth - 10 ,
        pdfHeight - 10,
        { align: "right" }
      );

      position += pageHeightPx;
      pageNumber++;

      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save("Resumen_Seleccion.pdf");
  } catch (error) {
    console.log("Error al exportar PDF:", error);
  }
};


  return (
    <div className="relative h-screen w-full select-none overflow-hidden">
      <BackgroundImage isLoginPage={false} />

      {/* Drawer Menu - renderizado globalmente */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />

      <MainContainer src={main_bg} isLoginPage={false}>
        <div className="z-10 flex h-full w-full flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <TaleniaNavbar
              isDrawerOpen={isDrawerOpen}
              onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            />

            <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-white/30 p-2 ring-1 ring-white/50">
              <div className="flex w-full items-center justify-between">
                <div className="flex w-full flex-row items-center gap-2">
                  <Button
                    variant="light"
                    isIconOnly
                    size="sm"
                    radius="full"
                    onPress={() => handleNavigation(`/projects/${id}`)}
                    className="group data-[hover]:bg-purple"
                    aria-label="Volver"
                  >
                    <IoIosArrowBack
                      size={20}
                      className="text-lightGray group-hover:text-white"
                    />
                  </Button>
                  <EditableProjectName
                    projectId={id as string}
                    userId={numericUserId}
                    setIsInfoModalOpen={setIsInfoModalOpen}
                  />
                </div>
                <div
                  onClick={exportSelectionSumary}
                  className="flex h-[40px] gap-2 w-fit items-center justify-between whitespace-nowrap rounded-[5px] bg-darkPurple px-4 hover:cursor-pointer"
                >
                  <AiOutlineFilePdf/><p>Exportar resumen</p>
                </div>
              </div>

              <div className="flex w-full shrink-0 gap-5 rounded-md px-4 py-2">
                <SelectionSummary
                  selectedCvs={selectedCvs}
                  allCandidates={allCandidates}
                />
                <div className="mx-1 my-2 w-px flex-shrink-0 rounded-3xl bg-dividerLight/40" />

                <CandidateStatusCards
                  selectedCandidates={allCandidates.filter((candidate) =>
                    selectedCvs.includes(candidate.id),
                  )}
                  totalCandidates={allCandidates.length}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid auto-rows-min grid-cols-2 gap-2 pr-3 md:grid-cols-3">
                {allCandidates
                  .filter((candidate) => selectedCvs.includes(candidate.id))
                  .map((candidate: CandidateUI) => (
                    <SelectedCandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onViewCV={handleViewCV}
                      isSelected={selectedCvs.includes(candidate.id)}
                      onToggleSelect={(candidateId, isSelected) => {
                        if (isSelected) {
                          addCvToSelectedCv(candidateId);
                        } else {
                          removeCvToSelectedCv(candidateId);
                        }
                      }}
                      onUpdate={fetchCVs}
                      onDirtyChange={setHasUnsavedChanges}
                    />
                  ))}
              </div>
            </div>

            {/* Footer */}
            <MainFooter />
          </div>
        </div>

        {project && (
          <ProjectInfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            info={{
              projectName: project.projectName,
              projectDescription: project.projectDescription,
            }}
          />
        )}
        <div className="absolute left-[-999999]" ref={selectionSummaryRef}>
          <PdfContent
            selectedCvs={selectedCvs}
            allCandidates={allCandidates}
            project={project?.projectName}
          ></PdfContent>
        </div>

        <ConfirmationModal
          isOpen={showExitModal}
          title="¿Salir sin guardar?"
          description="Hay cambios pendientes. Si sales ahora, se perderán."
          secondaryLabel="Seguir aquí"
          primaryLabel="Salir"
          onSecondaryClick={handleCancelExit}
          onPrimaryClick={handleConfirmExit}
        />

        <ViewCV
          isOpen={isOpen}
          onOpenChange={() => {}}
          onClose={onClose}
          candidate={cvInView}
        ></ViewCV>
      </MainContainer>
    </div>
  );
}
