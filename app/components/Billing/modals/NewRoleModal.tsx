import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import React from "react";
import { Toast } from "@heroui/react";
import { toast } from "sonner";
import { LiaGrinStars } from "react-icons/lia";

function NewRoleModal({ isOpen, onOpenChange, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="lg"
      className="bg-[#FFFFFF]"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[16px] text-[#372AAC]">
            Nuevo rol
          </ModalHeader>
          <ModalBody className="">
            <div className="w-full text-[12px] font-[400] text-darkPurple flex flex-col gap-2">
              <div>Nombre del rol</div>
              <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              <div>Descripcion de rol</div>
              <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
            </div>

            <p className=" text-[#372AAC]">
              Permisos
            </p>
            <div className="grid w-full grid-cols-2 grid-rows-3 text-[12px] font-[400] text-darkPurple">
              <div className="w-full px-1 py-1">
                <p>Razon social</p>
                <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Rut</p>
                <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Domicilio</p>
                <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Comuna</p>
                <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Giro del negocio</p>
                <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Celular</p>
                <input className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div
              onClick={() => {
                onClose();
              }}
              className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Cancelar
            </div>
            <div
              onClick={() => {
                toast("Usuario creado con exito", {
                  icon: <LiaGrinStars color="#372AAC" size={16} />,
                  duration: 2000,
                  style: { background: "#FFFFFF",display:"flex",justifyContent:"start",alignItems:"center",width:"280px" },
                });
                onClose();
              }}
              className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Crear
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

export default NewRoleModal;
