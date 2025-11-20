"use client";

import {
  Button,
  Input,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { CgExtensionAdd } from "react-icons/cg";
import { FiEdit3, FiStar } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdCheckCircleOutline } from "react-icons/md";
import { SecondaryButton } from "../Common/Buttons";
import CalendarPopover from "../Common/CalendarPopover";
import EmptyState from "../Common/EmptyState";
import { Project } from "@/app/types/project.types";
import { useCallback, useEffect, useState } from "react";
import { useProjectSearch } from "@/app/hooks/useProjectSearch";
import { folderService } from "@/app/api/folderService";
import { formatCalendarDate } from "@/app/utils/string.utils";
import { useRouter } from "next/navigation";

import folder_empty from "./../../assets/folder-closed.svg";
import { Folder } from "@/app/types/folder.types";
import { MdOutlineMoveUp } from "react-icons/md";
import { projectService } from "@/app/api/projectsService";
import { toast } from "sonner";
import ConfirmationModal from "../Modals/ConfirmationModal";
import RenameModal from "../Modals/RenameModal";
import MoveProject from "../Modals/MoveProject";
import { useAuth } from "@/app/context/AuthContext";
import useProjectPin from "@/app/hooks/useProjectPin";
import ProjectCard from "./ProjectCard";

interface ProjectSectionProps {
  folderId: string;
  onNewAnalysis: () => void;
  onGoBack: () => void;
  refreshProjects?: (refreshFn: () => void) => void;
}

const ProjectSection = ({
  folderId,
  onNewAnalysis,
  onGoBack,
  refreshProjects,
}: ProjectSectionProps) => {
  const router = useRouter();
  const { userId } = useAuth();
  const numericUserId = userId ? Number(userId) : undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [folder, setFolder] = useState<Folder>();

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    projectId: string;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    projectId: "",
  });

  const {
    searchTerm,
    inputSearch,
    selectedDate,
    setSelectedDate,
    handleSearchChange,
  } = useProjectSearch();

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isUncompleteOpen, setIsUncompleteOpen] = useState(false);

  const [projectToRename, setProjectToRename] = useState<{
    id: string;
    currentName: string;
  } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [moveProjectId, setMoveProjectId] = useState<string | null>(null);
  const [projectToComplete, setProjectToComplete] = useState<string | null>(
    null,
  );
  const [projectToUncomplete, setProjectToUncomplete] = useState<string | null>(
    null,
  );

  // Componente interno para manejar el pin de cada proyecto
  const PinButton = ({ projectId }: { projectId: string }) => {
    const { isPinned, togglePin } = useProjectPin(numericUserId, projectId);

    const handlePinClick = async () => {
      handleCloseContextMenu();
      await togglePin();
    };

    return (
      <button
        onClick={handlePinClick}
        className={`flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white`}
      >
        <FiStar
          className={`h-4 w-4 flex-shrink-0 ${isPinned ? "fill-current" : ""}`}
        />
        <p className="truncate whitespace-pre">
          {isPinned ? "Quitar de marcadores" : "Fijar a marcadores"}
        </p>
      </button>
    );
  };

  const fetchFolderProjects = useCallback(async () => {
    if (!folderId) {
      console.log("No folderId available yet");
      return;
    }

    try {
      setIsLoading(true);

      const apiResponse = await folderService.findProjectsFolder(
        folderId,
        formatCalendarDate(selectedDate),
        searchTerm,
      );

      setProjects(apiResponse);
      setError(null);
    } catch (err) {
      console.error("Error fetching folder req:", err);
      setError(
        "Hubo un error al cargar los requerimientos. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [folderId, selectedDate, searchTerm]);

  const fetchFolderById = useCallback(async () => {
    if (!folderId) {
      console.log("No folderId available yet");
      return;
    }
    try {
      setIsLoading(true);

      const apiResponse = await folderService.findFolderById(folderId);
      setFolder(apiResponse);
      setError(null);
    } catch (err) {
      console.error("Error fetching folder projects:", err);
      setError(
        "Hubo un error al cargar los requerimientos. Inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchFolderById();
    fetchFolderProjects();
  }, [fetchFolderById, fetchFolderProjects]);

  useEffect(() => {
    // Exponer la función de refresh al componente padre
    if (refreshProjects) {
      refreshProjects(fetchFolderProjects);
    }
  }, [refreshProjects, fetchFolderProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      projectId,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRenameOpen = useCallback((id: string, currentName: string) => {
    setProjectToRename({ id, currentName });
    setIsRenameOpen(true);
    handleCloseContextMenu(); // Cerrar el popover cuando se abre el modal
  }, []);

  const handleRenameClose = useCallback(() => {
    setIsRenameOpen(false);
    setProjectToRename(null);
  }, []);

  const handleDeleteOpen = useCallback((id: string) => {
    setProjectToDelete(id);
    setIsDeleteOpen(true);
    handleCloseContextMenu(); // Cerrar el popover cuando se abre el modal
  }, []);

  const handleDeleteClose = useCallback(() => {
    setIsDeleteOpen(false);
    setProjectToDelete(null);
  }, []);

  const handleMoveOpen = useCallback((id: string) => {
    setMoveProjectId(id);
    setIsMoveOpen(true);
    handleCloseContextMenu();
  }, []);

  const handleMoveClose = useCallback(() => {
    setIsMoveOpen(false);
    setMoveProjectId(null);
  }, []);

  const handleCompleteOpen = useCallback((id: string) => {
    setProjectToComplete(id);
    setIsCompleteOpen(true);
    handleCloseContextMenu();
  }, []);

  const handleCompleteClose = useCallback(() => {
    setIsCompleteOpen(false);
    setProjectToComplete(null);
  }, []);

  const handleUncompleteOpen = useCallback((id: string) => {
    setProjectToUncomplete(id);
    setIsUncompleteOpen(true);
    handleCloseContextMenu();
  }, []);

  const handleUncompleteClose = useCallback(() => {
    setIsUncompleteOpen(false);
    setProjectToUncomplete(null);
  }, []);

  const handleProjectRename = useCallback(
    async (newName: string, projectId: string) => {
      try {
        await projectService.updateProject({
          projectId,
          projectName: newName,
        });

        toast.success("Requerimiento renombrado correctamente");
        handleRenameClose();

        // Refrescar la lista de proyectos
        await fetchFolderProjects();

        return true;
      } catch (error) {
        console.error("Error renaming requerimiento:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al renombrar el requerimiento";
        toast.error("Error", {
          description: errorMessage,
        });
        return false;
      }
    },
    [handleRenameClose, fetchFolderProjects],
  );

  const handleProjectDelete = useCallback(
    async (projectId: string) => {
      try {
        await projectService.deleteProject(projectId);

        await fetchFolderProjects();

        toast.success("Requerimiento eliminado correctamente");
        handleDeleteClose();
      } catch (error) {
        console.error("Error deleting requerimiento:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al eliminar el requerimiento";
        toast.error("Error", {
          description: errorMessage,
        });
        throw error;
      }
    },
    [fetchFolderProjects, handleDeleteClose],
  );

  const handleProjectComplete = useCallback(
    async (projectId: string) => {
      try {
        await projectService.updateProject({
          projectId,
          processComplete: true,
        });

        await fetchFolderProjects();

        toast.success("Requerimiento marcado como completado");
        handleCompleteClose();
      } catch (error) {
        console.error("Error completing requerimiento:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al marcar el requerimiento como completado";
        toast.error("Error", {
          description: errorMessage,
        });
        throw error;
      }
    },
    [fetchFolderProjects, handleCompleteClose],
  );

  const handleProjectUncomplete = useCallback(
    async (projectId: string) => {
      try {
        await projectService.updateProject({
          projectId,
          processComplete: false,
        });

        await fetchFolderProjects();

        toast.success("Requerimiento marcado como no completado");
        handleUncompleteClose();
      } catch (error) {
        console.error("Error uncompleting requerimiento:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al marcar el requerimiento como no completado";
        toast.error("Error", {
          description: errorMessage,
        });
        throw error;
      }
    },
    [fetchFolderProjects, handleUncompleteClose],
  );

  return (
    <div className="my-2 flex h-full w-full flex-col rounded-md bg-gradient-to-r from-[#E9E3FF]/50 via-[#EEE9FF]/30 to-[#D9CEFF]/50 px-4 py-6 ring-1 ring-white/50 backdrop-blur-sm">
      {/* Projects Header */}
      <div className="mb-6 flex w-full flex-row items-center justify-between gap-2">
        <Button
          variant="light"
          isIconOnly
          size="sm"
          radius="full"
          onPress={onGoBack}
          className="group data-[hover]:bg-purple"
          aria-label="Volver"
        >
          <IoIosArrowBack
            size={20}
            className="text-lightGray group-hover:text-white"
          />
        </Button>
        <p
          className="cursor-pointer text-lg capitalize text-darkPurple"
          onClick={onGoBack}
        >
          {folder?.folderName || "Cargando..."}
        </p>

        <SecondaryButton
          label="Nuevo análisis"
          onClick={onNewAnalysis}
          className="ml-auto w-fit"
          icon={CgExtensionAdd}
          iconSize={18}
        />

        <Input
          variant="bordered"
          placeholder="Buscar"
          value={inputSearch}
          onValueChange={handleSearchChange}
          classNames={{
            inputWrapper:
              "rounded-md bg-white px-3 border-0 h-9 min-h-8 max-h-9 !text-darkPurple",
            input: "text-sm placeholder:text-sm py-0",
            base: "shadow-0 w-fit",
          }}
          startContent={<BiSearch className="text-lg text-[#CACCFD]" />}
        />

        <CalendarPopover
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Projects List */}
      <div className="h-full w-full overflow-y-auto p-1">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size="lg" variant="gradient" />
          </div>
        ) : error || projects.length === 0 ? (
          <EmptyState
            icon={folder_empty}
            message={
              error ||
              "Parece que no hay requerimientos por ahora. Cuando haya nuevos, los verás aquí."
            }
            isError={!!error}
          />
        ) : (
          <>
            <div className="grid w-full grid-cols-3 place-items-stretch gap-x-4 gap-y-1 pr-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {projects.map((project) => (
                <Popover
                  key={project.projectId}
                  isOpen={
                    contextMenu.isOpen &&
                    contextMenu.projectId === project.projectId
                  }
                  onOpenChange={(open) => {
                    if (!open && contextMenu.projectId === project.projectId) {
                      handleCloseContextMenu();
                    }
                  }}
                  placement="right-start"
                  showArrow
                >
                  <PopoverTrigger>
                    <div>
                      <ProjectCard
                        project={project}
                        onClick={() => handleProjectClick(project.projectId)}
                        onContextMenu={handleContextMenu}
                        isSelected={
                          contextMenu.isOpen &&
                          contextMenu.projectId === project.projectId
                        }
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-56 rounded-lg bg-white/70 p-3 backdrop-blur-sm">
                    <div className="flex w-52 flex-col gap-2">
                      <button
                        onClick={() =>
                          handleRenameOpen(
                            project.projectId,
                            project.projectName,
                          )
                        }
                        className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
                      >
                        <FiEdit3 className="h-4 w-4 flex-shrink-0" />
                        <p className="truncate whitespace-pre">Renombrar</p>
                      </button>

                      <PinButton projectId={project.projectId} />

                      <button
                        onClick={() => handleMoveOpen(project.projectId)}
                        className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
                      >
                        <MdOutlineMoveUp className="h-4 w-4 flex-shrink-0" />
                        <p className="truncate whitespace-pre">Mover</p>
                      </button>

                      {!project.processComplete && (
                        <button
                          onClick={() => handleCompleteOpen(project.projectId)}
                          className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
                        >
                          <MdCheckCircleOutline className="h-4 w-4 flex-shrink-0" />
                          <p className="truncate whitespace-pre">Completar</p>
                        </button>
                      )}

                      {project.processComplete && (
                        <button
                          onClick={() =>
                            handleUncompleteOpen(project.projectId)
                          }
                          className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
                        >
                          <MdCheckCircleOutline className="h-4 w-4 flex-shrink-0" />
                          <p className="truncate whitespace-pre">
                            Marcar como no completado
                          </p>
                        </button>
                      )}

                      <hr />

                      <button
                        onClick={() => handleDeleteOpen(project.projectId)}
                        className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-red-400 hover:text-white"
                      >
                        <RiDeleteBin2Line className="h-4 w-4 flex-shrink-0" />
                        <p className="truncate whitespace-pre">Eliminar</p>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      <RenameModal
        title="Renombrar requerimiento"
        isOpen={isRenameOpen}
        onClose={handleRenameClose}
        currentName={projectToRename?.currentName || ""}
        onRename={async (newName) => {
          if (!projectToRename?.id) return false;
          return handleProjectRename(newName, projectToRename.id);
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onSecondaryClick={handleDeleteClose}
        title="¿Eliminar requerimiento?"
        description="Estás a punto de eliminar este requerimiento. Esta acción no se puede deshacer."
        secondaryLabel="Cancelar"
        primaryLabel="Eliminar"
        onPrimaryClick={async () => {
          if (projectToDelete) {
            await handleProjectDelete(projectToDelete);
            return true;
          }
          return false;
        }}
      />

      <ConfirmationModal
        isOpen={isCompleteOpen}
        onSecondaryClick={handleCompleteClose}
        title="¿Completar requerimiento?"
        description="Esto marcará el requerimiento como completado."
        secondaryLabel="Cancelar"
        primaryLabel="Guardar"
        onPrimaryClick={async () => {
          if (projectToComplete) {
            await handleProjectComplete(projectToComplete);
            return true;
          }
          return false;
        }}
      />

      <ConfirmationModal
        isOpen={isUncompleteOpen}
        onSecondaryClick={handleUncompleteClose}
        title="¿Marcar requerimiento como no completado?"
        description="El requerimiento volverá a su estado activo."
        secondaryLabel="Cancelar"
        primaryLabel="Guardar"
        onPrimaryClick={async () => {
          if (projectToUncomplete) {
            await handleProjectUncomplete(projectToUncomplete);
            return true;
          }
          return false;
        }}
      />

      <MoveProject
        projectId={moveProjectId || ""}
        folderId={folderId}
        isOpen={isMoveOpen}
        onClose={handleMoveClose}
        onProjectMoved={() => fetchFolderProjects()}
      />
    </div>
  );
};

export default ProjectSection;
export type { ProjectSectionProps };
