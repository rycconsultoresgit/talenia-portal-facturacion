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

interface RenameProjectModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (newName: string) => Promise<boolean | undefined>;
}

const RenameModal = ({
  title,
  isOpen,
  onClose,
  currentName,
  onRename,
}: Readonly<RenameProjectModalProps>) => {
  const [newName, setNewName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName, isOpen]);

  const handleSubmit = async () => {
    if (!newName.trim()) return;

    try {
      setIsLoading(true);
      await onRename(newName);
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
          <h3 className="text-base font-medium text-primaryBlue">{title}</h3>

          <CloseModalButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="px-4 py-3">
          <Input
            type="text"
            placeholder="Ingrese el nuevo nombre"
            label="Nombre"
            labelPlacement="outside"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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
            onClick={onClose}
            disabled={isLoading}
          />

          <PrimaryButton
            label="Guardar"
            onClick={handleSubmit}
            disabled={!newName.trim() || isLoading}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenameModal;
