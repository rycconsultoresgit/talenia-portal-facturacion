"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import {
  CloseModalButton,
  PrimaryButton,
  SecondaryButton,
} from "../Common/Buttons";
import { folderService } from "@/app/api/folderService";

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated?: () => void;
}

export default function NewFolderModal({
  isOpen,
  onClose,
  onFolderCreated,
}: Readonly<NewFolderModalProps>) {
  const { userId } = useAuth();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // El cargo debe tener al menos un carácter alfanumérico real
  const isValidTitle = (str: string) => /[\p{L}\p{N}]/u.test(str.trim());

  const validateForm = (): boolean => {
    if (!isValidTitle(title)) {
      toast.error("Error", {
        description: "El nombre es requerido",
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
      await folderService.createFolder(userId, title.trim());
      toast.success("Carpeta creada exitosamente");
      setTitle("");
      onFolderCreated();
      onClose();
    } catch (err) {
      console.error("Error creating folder:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear la carpeta";
      toast.error("Error al crear la carpeta", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
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
      className="max-w-md rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-primaryBlue">
            Nueva carpeta
          </h3>

          <CloseModalButton onClick={handleClose} />
        </ModalHeader>

        <ModalBody className="px-4 py-3">
          <Input
            type="text"
            placeholder="Ingresa el nombre de la carpeta"
            label="Nombre"
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
        </ModalBody>

        <ModalFooter className="space-x-2">
          <SecondaryButton
            label="Cancelar"
            onClick={handleClose}
            disabled={isLoading}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />

          <PrimaryButton
            label={`${isLoading ? "Creando..." : "Aceptar"}`}
            onClick={handleSubmit}
            disabled={!isValidTitle(title) || isLoading}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
