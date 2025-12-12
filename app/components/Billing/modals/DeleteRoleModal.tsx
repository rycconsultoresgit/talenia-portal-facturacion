import { userService } from "@/app/api/userService";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import React from "react";
import { LiaGrinStars } from "react-icons/lia";
import { toast } from "sonner";

function DeleteRolModal({ rol, isOpen, onOpenChange, onClose }) {
  const handleDelete = async () => {
    try {
      await userService.deleteRole(rol?.id);
      onClose();
      toast("rol eliminado con exito", {
        icon: <LiaGrinStars color="#372AAC" size={16} />,
        duration: 2000,
        style: {
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "280px",
        },
      });
    } catch (error) {
      toast("Error al borrar el rol", {
        icon: <LiaGrinStars color="#372AAC" size={16} />,
        duration: 2000,
        style: {
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "280px",
        },
      });
    }
  };
  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[#372AAC]">
            ¿ Eliminar rol {rol?.id}?
          </ModalHeader>
          <ModalBody>
            <p className="text-center text-[14px] font-[300] text-darkPurple">
              Una vez eliminado, no podrás recuperar la información de este rol.
            </p>
          </ModalBody>
          <ModalFooter className="flex w-full justify-between px-8">
            <div
              onClick={() => {
                onClose();
              }}
              className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Cancelar
            </div>
            <div
              onClick={async () => {
                handleDelete();
              }}
              className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Eliminar
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

export default DeleteRolModal;
