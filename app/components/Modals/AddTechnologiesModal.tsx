"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import {
  CloseModalButton,
  PrimaryButton,
  SecondaryButton,
} from "../Common/Buttons";

interface AddTechnologiesModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAdd: (newName: string) => Promise<void>;
}

export default function AddTechnologiesModal({
  isOpen,
  onClose,
  onAdd,
}: AddTechnologiesModalProps) {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewName("");
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!newName.trim()) return;

    try {
      setIsLoading(true);
      await onAdd(newName);
      onClose();
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
            Agregar tecnología
          </h3>

          <CloseModalButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="px-4 py-3">
          <Input
            type="text"
            placeholder="Ingrese la tecnología"
            label="Tecnología"
            labelPlacement="outside"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            isDisabled={isLoading}
            isRequired
            size="md"
            classNames={{
              label: "text-sm text-darkPurple",
              inputWrapper: "rounded-md bg-white px-2 border-0",
              input: "text-base text-black  placeholder:text-sm py-0",
            }}
          />
        </ModalBody>

        <ModalFooter className="space-x-2">
          <SecondaryButton
            label="Cancelar"
            onClick={onClose}
            disabled={isLoading}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />

          <PrimaryButton
            label={`${isLoading ? "Guardando..." : "Guardar"}`}
            onClick={handleSubmit}
            disabled={!newName.trim() || isLoading}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
