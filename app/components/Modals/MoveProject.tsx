import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  CloseModalButton,
  PrimaryButton,
  SecondaryButton,
} from "../Common/Buttons";
import { useEffect, useState } from "react";
import { folderService } from "@/app/api/folderService";
import { useAuth } from "@/app/context/AuthContext";
import { Folder } from "@/app/types/folder.types";
import folder_icon from "./../../assets/folder.svg";
import Image from "next/image";

import { toast } from "sonner";
import { BiSearch } from "react-icons/bi";

interface MoveProjectModalProps {
  projectId: string;
  folderId: string;
  isOpen: boolean;
  onClose: () => void;
  onProjectMoved?: () => void;
}

const MoveProject = ({
  projectId,
  isOpen,
  onClose,
  onProjectMoved,
}: MoveProjectModalProps) => {
  const { userId } = useAuth();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isFoldersLoading, setIsFoldersLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserFolders = async () => {
      if (isOpen && userId) {
        setIsFoldersLoading(true);
        try {
          const userFolders = await folderService.findFoldersByUser(userId);
          console.log("Carpetas del usuario cargadas:", userFolders);
          setFolders(userFolders);
        } catch (error) {
          console.error("Error fetching folders:", error);
          toast.error("Error al cargar las carpetas", {
            description: "No se pudieron cargar las carpetas disponibles",
          });
        } finally {
          setIsFoldersLoading(false);
        }
      }
    };

    fetchUserFolders();
  }, [isOpen, userId]);

  const validateForm = (): boolean => {
    if (!userId) {
      toast.error("Error", {
        description: "No se pudo identificar al usuario",
      });
      return false;
    }

    if (!projectId || projectId.trim() === "") {
      toast.error("Error", {
        description: "No se pudo identificar el reqruerimiento",
      });
      return false;
    }

    if (!selectedFolderId) {
      toast.error("Carpeta requerida", {
        description: "Por favor, selecciona una carpeta de destino",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Asegurarse de que selectedFolderId no sea null
    if (!selectedFolderId) {
      toast.error("Error", {
        description: "Por favor, selecciona una carpeta de destino",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Moving project:", { projectId, selectedFolderId });
      await folderService.moveProjectToFolder(projectId, selectedFolderId);

      toast.success("Requerimiento movido", {
        description: "El requerimiento se ha movido correctamente",
      });

      onClose();

      // Llamar al callback si existe para refrescar la lista
      if (onProjectMoved) {
        onProjectMoved();
      }
    } catch (error) {
      console.error("Error moving project:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al mover el requerimiento";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="max-w-md rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-primaryBlue">
            Mover requerimiento
          </h3>

          <CloseModalButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="px-4 py-3">
          <Autocomplete
            label="Guardar en carpeta automáticamente"
            placeholder={
              isFoldersLoading
                ? "Cargando carpetas..."
                : "Selecciona la carpeta"
            }
            labelPlacement="outside"
            isRequired
            isDisabled={isLoading || isFoldersLoading}
            isLoading={isFoldersLoading}
            selectedKey={selectedFolderId}
            onSelectionChange={(key) =>
              setSelectedFolderId(key as string | null)
            }
            variant="flat"
            size="md"
            radius="sm"
            startContent={<BiSearch size={24} className="text-[#CACCFD]" />}
            classNames={{
              base: "text-base text-black placeholder:text-sm py-0 rounded-xl",
              popoverContent:
                "bg-white/50 backdrop-blur-sm rounded-xl text-black",
              clearButton:
                "data-[hover]:bg-purple/50 data-[hover]:text-white rounded-md mx-2",
              selectorButton:
                "data-[hover]:bg-purple/50 data-[hover]:text-white rounded-md",
            }}
            scrollShadowProps={{
              isEnabled: false,
            }}
            inputProps={{
              classNames: {
                input: "text-base text-black placeholder:text-sm py-0",
                inputWrapper: "rounded-md bg-white h-full",
                label: "text-sm text-darkPurple",
              },
            }}
            listboxProps={{
              classNames: {
                list: "rounded-md space-y-1",
              },
            }}
          >
            {folders.map((folder) => (
              <AutocompleteItem
                key={folder.folderId}
                classNames={{
                  base: "data-[hover]:bg-purple data-[hover]:text-white text-darkPurple bg-white/50",
                }}
                textValue={folder.folderName}
              >
                <div className="flex flex-row items-center justify-start gap-2">
                  <Image
                    src={folder_icon}
                    alt="Folder Icon"
                    className="size-7 p-1"
                  />

                  <div className="flex flex-col">
                    <h3 className="text-sm font-normal capitalize">
                      {folder.folderName}
                    </h3>
                    <p className="text-xs font-normal">
                      {folder.projects.length} requerimientos
                    </p>
                  </div>
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </ModalBody>

        <ModalFooter className="space-x-2">
          <SecondaryButton
            label="Cancelar"
            onClick={onClose}
            disabled={isLoading}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />

          <PrimaryButton
            label="Mover"
            onClick={handleSubmit}
            disabled={isLoading || !selectedFolderId}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MoveProject;
