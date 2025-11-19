"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  CloseModalButton,
  PrimaryButton,
} from "@/app/components/Common/Buttons";

interface ProjectInfoProps {
  isOpen: boolean;
  onClose: () => void;
  info: {
    projectName: string;
    projectDescription: string;
  };
}

const ProjectInfo = ({ isOpen, onClose, info }: ProjectInfoProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-semibold text-primaryBlue">
            Información del análisis
          </h2>
          <CloseModalButton onClick={onClose} isLoading={false} />
        </ModalHeader>

        <ModalBody className="flex gap-4 overflow-y-auto px-4 py-3 text-sm font-light text-darkPurple">
          <div>
            <h3 className="text-base font-semibold text-primaryBlue">
              Nombre del cargo:
            </h3>
            {info.projectName}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-primaryBlue">
              Descripción del cargo
            </h3>
            <p className="whitespace-pre-wrap text-pretty text-sm font-light text-darkPurple">
              {info.projectDescription}
            </p>
          </div>
        </ModalBody>

        <ModalFooter className="space-x-2">
          <PrimaryButton label="Cerrar" onClick={onClose} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectInfo;
