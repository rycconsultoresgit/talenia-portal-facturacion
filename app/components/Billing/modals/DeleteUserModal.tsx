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
import {toast} from 'sonner'

function DeleteUserModal({ user,isOpen, onOpenChange,onClose }) {
  return (
    <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[#372AAC]">
            ¿ Eliminar usuario {user?.user_id}?
          </ModalHeader>
          <ModalBody>
            <p className="text-darkPurple text-[14px] font-[300] text-center ">
              Una vez eliminado, no podrás recuperar la información de este usuario.
            </p>
            
          </ModalBody>
          <ModalFooter className="w-full flex justify-between px-8">
            <div onClick={()=>{onClose() 
            }} className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer">
              Cancelar
            </div>
            <div onClick={async ()=>{
              await userService.deleteUser(user?.user_id)
              onClose()
              toast("Usuario eliminado con exito", {
                  icon: <LiaGrinStars color="#372AAC" size={16} />,
                  duration: 2000,
                  style: { background: "#FFFFFF",display:"flex",justifyContent:"start",alignItems:"center",width:"280px" },
                });
            }} className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer">
              Eliminar
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

export default DeleteUserModal;
