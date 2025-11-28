import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
} from "@heroui/react";
import React from "react";
import { LiaGrinStars } from "react-icons/lia";
import {toast} from "sonner"

function EditUserModal({ isOpen, onOpenChange,onClose }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size="xl">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[#372AAC]">
            Editar cliente
          </ModalHeader>
          <ModalBody>
            <div className="w-full grid grid-cols-2 grid-rows-3 text-darkPurple text-[12px] font-[400] ">
                <div className="w-full px-1 py-1"><p>Nombre</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Rut</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>E-mail</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Empresa</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Plan</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Rol</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
            </div>
            <p className="text-[14px] text-[#947CE7]">*El cambio de plan se hará efectivo al comenzar la próxima facturación.</p>
            <Switch><p className="text-[14px] font-[400]">Habilitado</p></Switch>

            <p className="text-[#372AAC] border-t-1 pt-4">Datos de facturacion</p>
            <div className="w-full grid grid-cols-2 grid-rows-3 text-darkPurple text-[12px] font-[400] ">
                <div className="w-full px-1 py-1"><p>Razon social</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Rut</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Domicilio</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Comuna</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Giro del negocio</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
                <div className="w-full px-1 py-1"><p>Celular</p><input className="w-full focus:outline-none border rounded-[5px] px-2 py-2"></input></div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div onClick={()=>{onClose()}} className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer">
              Cancelar
            </div>
            <div onClick={()=>{onClose() 
              toast("Usuario editado con exito", {
                  icon: <LiaGrinStars color="#372AAC" size={16} />,
                  duration: 2000,
                  style: { background: "#FFFFFF",display:"flex",justifyContent:"start",alignItems:"center",width:"280px" },
                });
            }} className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer">
              Guardar
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

export default EditUserModal;
