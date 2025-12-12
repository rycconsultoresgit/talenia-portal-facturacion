import { plansService } from "@/app/api/plansService";
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

function DeletePlanModal({ plan, isOpen, onOpenChange, onClose }) {
  const handleDelete = async () => {
    try {
      await plansService.deletePlan(plan?.id);
      toast("Plan eliminado con exito", {
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
                onClose();
    } catch (error) {
      console.log("Error al borrar el plan", error);
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
            ¿ Eliminar Plan {plan?.id}?
          </ModalHeader>
          <ModalBody>
            <p className="text-center text-[14px] font-[300] text-darkPurple">
              Una vez eliminado, no podrás recuperar la información de este
              plan.
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
                handleDelete()
                
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

export default DeletePlanModal;
