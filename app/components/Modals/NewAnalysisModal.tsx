"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  Textarea,
  ModalBody,
  ModalFooter,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { CgUserList } from "react-icons/cg";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import {
  CloseModalButton,
  PrimaryButton,
  SecondaryButton,
} from "../Common/Buttons";
import { projectService } from "@/app/api/projectsService";
import { folderService } from "@/app/api/folderService";
import { BiSearch } from "react-icons/bi";
import { Folder } from "@/app/types/folder.types";

interface NewAnalysisModalProps {
  isHomePage?: boolean;
  folderId: string;
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

export default function NewAnalysisModal({
  isHomePage = false,
  folderId,
  isOpen,
  onClose,
  onProjectCreated,
}: Readonly<NewAnalysisModalProps>) {
  const { userId } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [isFoldersLoading, setIsFoldersLoading] = useState(false);

  // El cargo debe tener al menos un carácter alfanumérico real
  const isValidTitle = (str: string) => /[\p{L}\p{N}]/u.test(str.trim());
  // La descripción debe tener al menos 500 caracteres reales (sin espacios)
  const countNonSpaceChars = (str: string) => str.replace(/\s/g, "").length;
  const isValidDescription = (str: string) => countNonSpaceChars(str) >= 500;

  // Cargar carpetas del usuario cuando el modal se abre y es HomePage
  useEffect(() => {
    const fetchUserFolders = async () => {
      if (isHomePage && isOpen && userId) {
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
  }, [isHomePage, isOpen, userId]);

  const validateForm = (): boolean => {
    if (!isValidTitle(title)) {
      toast.error("Error", {
        description: "El título es requerido",
      });
      return false;
    }

    if (!isValidDescription(description)) {
      toast.error("Error", {
        description:
          "La descripción debe tener al menos 500 caracteres reales (no espacios).",
      });
      return false;
    }

    if (isHomePage && !selectedFolderId && !showNewFolderInput) {
      toast.error("Error", {
        description: "Debes seleccionar una carpeta o crear una nueva",
      });
      return false;
    }

    if (isHomePage && showNewFolderInput && !newFolderName.trim()) {
      toast.error("Error", {
        description: "Debes ingresar un nombre para la nueva carpeta",
      });
      return false;
    }

    if (!userId) {
      toast.error("Error", {
        description: "No se pudo identificar al usuario",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let targetFolderId = folderId;

      // Si es HomePage, determinar el folderId correcto
      if (isHomePage) {
        if (showNewFolderInput && newFolderName.trim()) {
          // Crear nueva carpeta primero
          const newFolder = await folderService.createFolder(
            userId,
            newFolderName.trim(),
          );
          targetFolderId = newFolder.folderId;
        } else if (selectedFolderId) {
          // Usar la carpeta seleccionada
          targetFolderId = selectedFolderId;
        }
      }

      // Crear el proyecto en la carpeta correspondiente
      await projectService.createProject(
        title.trim(),
        description.trim(),
        userId,
        targetFolderId,
      );

      toast.success("Requerimiento creado exitosamente");
      setTitle("");
      setDescription("");
      setShowNewFolderInput(false);
      setNewFolderName("");
      setSelectedFolderId("");
      onProjectCreated?.();
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el requerimiento";
      toast.error("Error al crear el requerimiento", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setShowNewFolderInput(false);
    setNewFolderName("");
    setSelectedFolderId("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="max-w-xl rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <h3 className="text-base font-medium text-primaryBlue">
            Nuevo análisis
          </h3>

          <CloseModalButton onClick={handleClose} />
        </ModalHeader>

        <ModalBody>
          <Input
            type="text"
            placeholder="Ingresa el nombre del cargo"
            label="Cargo"
            labelPlacement="outside"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isDisabled={isLoading}
            isRequired
            size="md"
            classNames={{
              label: "text-sm text-darkPurple",
              inputWrapper: "rounded-md bg-white px-2 border-0",
              input: "text-base text-black placeholder:text-sm py-0",
            }}
          />
          <Textarea
            placeholder="Ingresa una descripción del cargo"
            value={description}
            label="Descripción del cargo"
            description={`Mínimo 500 caracteres - ${countNonSpaceChars(description)}`}
            labelPlacement="outside"
            isRequired
            onChange={(e) => setDescription(e.target.value)}
            isDisabled={isLoading}
            startContent={<CgUserList size={18} className="text-[#372AAC]" />}
            size="md"
            classNames={{
              label: "text-sm text-darkPurple",
              inputWrapper: "rounded-md bg-white pe-10 h-full",
              clearButton: "text-[#372AAC]",
              input: "text-base text-black placeholder:text-sm py-0",
            }}
            onClear={() => setDescription("")}
          />

          {isHomePage && (
            <div className="flex flex-col items-start gap-4">
              <Autocomplete
                label="Guardar en carpeta automáticamente"
                placeholder={
                  isFoldersLoading
                    ? "Cargando carpetas..."
                    : "Selecciona la carpeta"
                }
                labelPlacement="outside"
                isRequired
                isDisabled={showNewFolderInput || isLoading || isFoldersLoading}
                isLoading={isFoldersLoading}
                selectedKey={selectedFolderId}
                onSelectionChange={(key) => setSelectedFolderId(key as string)}
                variant="flat"
                size="md"
                radius="sm"
                startContent={<BiSearch size={24} className="text-[#CACCFD]" />}
                classNames={{
                  base: "text-base text-black placeholder:text-sm py-0 rounded-md",
                  popoverContent:
                    "bg-white/90 backdrop-blur-sm rounded-md text-black",
                  clearButton:
                    "data-[hover]:bg-purple/50 data-[hover]:text-white rounded-md mx-2",
                  selectorButton:
                    "data-[hover]:bg-purple/50 data-[hover]:text-white rounded-md",
                }}
                inputProps={{
                  classNames: {
                    input: "text-base text-black placeholder:text-sm py-0",
                    inputWrapper: "rounded-md bg-white h-full",
                    label: "text-sm text-darkPurple",
                  },
                }}
              >
                {folders.map((folder) => (
                  <AutocompleteItem
                    key={folder.folderId}
                    classNames={{
                      base: "data-[hover]:bg-purple data-[hover]:text-white",
                    }}
                  >
                    {folder.folderName}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              {!showNewFolderInput && (
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="text-sm font-medium text-lightGray transition-colors hover:text-purple"
                  type="button"
                >
                  +Nueva carpeta
                </button>
              )}

              {showNewFolderInput && (
                <Input
                  type="text"
                  placeholder="Ingresa el nombre de la carpeta"
                  label="Nueva carpeta"
                  labelPlacement="outside"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  isDisabled={isLoading}
                  isRequired
                  size="md"
                  classNames={{
                    label: "text-sm text-darkPurple",
                    inputWrapper: "rounded-md bg-white px-2 border-0",
                    input: "text-base text-black placeholder:text-sm py-0",
                  }}
                />
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter className="space-x-2">
          <SecondaryButton
            label="Cancelar"
            onClick={handleClose}
            disabled={isLoading}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />

          <PrimaryButton
            label={`${isLoading ? "Creando..." : "Crear"}`}
            onClick={handleSubmit}
            disabled={
              !isValidTitle(title) ||
              !isValidDescription(description) ||
              (isHomePage && !selectedFolderId && !showNewFolderInput) ||
              (isHomePage && showNewFolderInput && !newFolderName.trim()) ||
              isLoading
            }
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
