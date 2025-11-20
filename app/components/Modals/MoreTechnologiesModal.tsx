"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { CloseModalButton, PrimaryButton } from "../Common/Buttons";

const MoreTechnologiesModal = ({
  isOpen,
  onClose,
  technologies,
}: {
  isOpen: boolean;
  onClose: () => void;
  technologies: string[];
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="max-w-2xl rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-primaryBlue">
            Todas las tecnologías
          </h3>
          <CloseModalButton onClick={onClose} />
        </ModalHeader>

        <ModalBody
          className={`gt-scroll-white w-full overflow-y-auto px-4 py-3`}
        >
          <div className="flex w-full flex-wrap gap-3">
            {technologies
              .toSorted((a, b) => a.localeCompare(b))
              .map((tech, index) => (
                <div
                  title={tech}
                  key={`${tech}-${index}`}
                  className="flex-shrink-0 rounded-xl bg-activeTab px-2"
                >
                  <span className="text-xs font-normal text-darkPurple">
                    {tech}
                  </span>
                </div>
              ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <PrimaryButton label="Cerrar" onClick={onClose} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MoreTechnologiesModal;
