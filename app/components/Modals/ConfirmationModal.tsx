"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { SecondaryButton, PrimaryButton } from "../Common/Buttons";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  secondaryLabel: string;
  primaryLabel: string;
  onSecondaryClick: () => void;
  onPrimaryClick: () => void;
}

/**
 * Modal de confirmación generico para cualquier operación
 */
const ConfirmationModal = ({
  isOpen,
  title,
  description,
  secondaryLabel,
  primaryLabel,
  onSecondaryClick,
  onPrimaryClick,
}: ConfirmationModalProps) => {
  const handleSecondaryClick = () => {
    onSecondaryClick();
  };

  const handlePrimaryClick = () => {
    onPrimaryClick();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onSecondaryClick}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="max-w-sm rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="mx-auto px-0 pt-6 pb-0">
          <label className="text-center text-primaryBlue">{title}</label>
        </ModalHeader>

        <ModalBody className="text-pretty text-center text-sm font-light text-darkPurple">
          {description}
        </ModalBody>
        <ModalFooter className="flex flex-row justify-around gap-3">
          <SecondaryButton
            label={secondaryLabel}
            onClick={handleSecondaryClick}
            className="w-1/2"
          />
          <PrimaryButton
            label={primaryLabel}
            onClick={handlePrimaryClick}
            className="w-1/2"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
