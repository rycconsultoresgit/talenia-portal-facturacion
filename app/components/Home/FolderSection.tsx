"use client";

import { SecondaryButton } from "../Common/Buttons";
import {
  Input,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { BiSearch } from "react-icons/bi";
import FolderCard from "./FolderCard";
import CalendarPopover from "../Common/CalendarPopover";
import { Folder } from "@/app/types/folder.types";
import { useCallback, useEffect, useState } from "react";
import { folderService } from "@/app/api/folderService";
import useFolderSearch from "@/app/hooks/useFolderSearch";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";

import folder_empty from "./../../assets/folder-closed.svg";
import add_folder_icon from "./../../assets/add_folder_icon.svg";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCalendarDate } from "@/app/utils/string.utils";
import EmptyState from "../Common/EmptyState";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { toast } from "sonner";
import RenameModal from "../Modals/RenameModal";

interface FolderSectionProps {
  userId: number;
  onOpenNewFolder: () => void;
  onRefreshReady?: (refreshFn: () => void) => void;
}

const FolderSection = ({
  userId,
  onOpenNewFolder,
  onRefreshReady,
}: FolderSectionProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    folderId: string;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    folderId: "",
  });

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<{
    id: string;
    currentName: string;
  } | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  const {
    searchTerm,
    inputSearch,
    selectedDate,
    setSelectedDate,
    handleSearchChange,
  } = useFolderSearch();

  const fetchUserFolders = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Get folders with filters
      const apiResponse = await folderService.findFoldersByUser(
        userId,
        formatCalendarDate(selectedDate),
        searchTerm,
      );

      setFolders(apiResponse);
      setError(null);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError("Error al cargar las carpetas. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedDate, searchTerm]);

  useEffect(() => {
    fetchUserFolders();
  }, [fetchUserFolders]);

  // Pasar la función de refresh al padre cuando esté lista
  useEffect(() => {
    if (onRefreshReady) {
      onRefreshReady(fetchUserFolders);
    }
  }, [onRefreshReady, fetchUserFolders]);

  const handleContextMenu = (e: React.MouseEvent, folderId: string) => {
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      folderId,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/folders/${folderId}`);
  };

  const handleRenameOpen = useCallback((id: string, currentName: string) => {
    setFolderToRename({ id, currentName });
    setIsRenameOpen(true);
    handleCloseContextMenu(); // Cerrar el popover cuando se abre el modal
  }, []);

  const handleRenameClose = useCallback(() => {
    setIsRenameOpen(false);
    setFolderToRename(null);
  }, []);

  const handleDeleteOpen = useCallback((id: string) => {
    setFolderToDelete(id);
    setIsDeleteOpen(true);
    handleCloseContextMenu(); // Cerrar el popover cuando se abre el modal
  }, []);

  const handleDeleteClose = useCallback(() => {
    setIsDeleteOpen(false);
    setFolderToDelete(null);
  }, []);

  const handleFolderDelete = useCallback(
    async (folderId: string) => {
      try {
        await folderService.deleteFolder(folderId);

        await fetchUserFolders();

        toast.success("Carpeta eliminada correctamente");
        handleDeleteClose();
      } catch (error) {
        console.error("Error deleting project:", error);

        // Traducir mensajes de error del backend
        let errorMessage = "Error al eliminar la carpeta";
        if (error instanceof Error) {
          const message = error.message;

          // Detectar el error específico de carpeta con proyectos
          if (
            message.includes("Cannot delete folder with") &&
            message.includes("project(s)")
          ) {
            const projectCount = message.match(/\d+/)?.[0] || "varios";
            errorMessage = `No se puede eliminar la carpeta porque contiene ${projectCount} requerimiento(s). Por favor, muevelos o eliminalos primero.`;
          } else {
            errorMessage = message;
          }
        }

        toast.error("Error", {
          description: errorMessage,
        });
        throw error;
      }
    },
    [fetchUserFolders, handleDeleteClose],
  );

  const handleFolderRename = useCallback(
    async (newName: string, folderId: string) => {
      try {
        await folderService.updateFolder(folderId, newName);

        toast.success("Carpeta renombrada correctamente");
        handleRenameClose();

        // Refrescar la lista de carpetas
        await fetchUserFolders();

        return true;
      } catch (error) {
        console.error("Error renaming folder:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al renombrar la carpeta";
        toast.error("Error", {
          description: errorMessage,
        });
        return false;
      }
    },
    [handleRenameClose, fetchUserFolders],
  );

  return (
    <div className="mb-2 flex h-1/2 w-full flex-col rounded-md bg-gradient-to-r from-[#E9E3FF]/50 via-[#EEE9FF]/30 to-[#D9CEFF]/50 px-4 py-6 ring-1 ring-white/50 backdrop-blur-sm">
      {/* Folder Header */}
      <div className="mb-6 flex w-full flex-row items-center justify-between gap-2">
        <p className="text-lg text-lightGray">Requerimientos</p>

        <SecondaryButton
          label="Nueva carpeta"
          onClick={onOpenNewFolder}
          className="ml-auto w-fit"
          imageNode={
            <Image
              src={add_folder_icon}
              alt="Nueva carpeta"
              className="size-5"
            />
          }
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

      {/* Folder List */}
      <div className="h-full w-full overflow-y-auto p-1">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size="lg" variant="gradient" />
          </div>
        ) : error || folders.length === 0 ? (
          <EmptyState
            icon={folder_empty}
            message={
              error ||
              "Parece que no hay requerimientos por ahora. Cuando haya nuevos, los verás aquí."
            }
            isError={!!error}
          />
        ) : (
          <div className="grid w-full grid-cols-3 place-items-stretch gap-x-4 gap-y-1 pr-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {folders.map((folder) => (
              <Popover
                key={folder.folderId}
                isOpen={
                  contextMenu.isOpen && contextMenu.folderId === folder.folderId
                }
                onOpenChange={(open) => {
                  if (!open && contextMenu.folderId === folder.folderId) {
                    handleCloseContextMenu();
                  }
                }}
                placement="right-start"
                showArrow
              >
                <PopoverTrigger>
                  <div>
                    <FolderCard
                      folder={folder}
                      onClick={() => handleFolderClick(folder.folderId)}
                      onContextMenu={handleContextMenu}
                      isSelected={
                        contextMenu.isOpen &&
                        contextMenu.folderId === folder.folderId
                      }
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="max-w-56 rounded-lg bg-white/70 p-3 backdrop-blur-sm">
                  <div className="flex w-52 flex-col gap-2">
                    <button
                      onClick={() =>
                        handleRenameOpen(folder.folderId, folder.folderName)
                      }
                      className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
                    >
                      <FiEdit3 className="h-4 w-4 flex-shrink-0" />
                      <p className="truncate whitespace-pre">Renombrar</p>
                    </button>

                    <hr />

                    <button
                      onClick={() => handleDeleteOpen(folder.folderId)}
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
        )}
      </div>

      <RenameModal
        title="Renombrar carpeta"
        isOpen={isRenameOpen}
        onClose={handleRenameClose}
        currentName={folderToRename?.currentName || ""}
        onRename={async (newName) => {
          if (!folderToRename?.id) return false;
          return handleFolderRename(newName, folderToRename.id);
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        title="¿Eliminar carpeta?"
        description="Eliminar una carpeta también eliminará todos los requerimientos asociados. Esta acción no se puede deshacer."
        secondaryLabel="Cancelar"
        primaryLabel="Eliminar"
        onSecondaryClick={handleDeleteClose}
        onPrimaryClick={async () => {
          if (folderToDelete) {
            await handleFolderDelete(folderToDelete);
            return true;
          }
          return false;
        }}
      />
    </div>
  );
};

export default FolderSection;
