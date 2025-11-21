import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";
import React from "react";
import { BsCardChecklist } from "react-icons/bs";
import { CiMoneyCheck1, CiLock } from "react-icons/ci";
import { FiSettings } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { PiKeyLight } from "react-icons/pi";
import Image from "next/image";
import purpleLogo from "../../assets/logo_purple.png";

function Sidebar({ isOpen, onOpenChange, changeView }) {
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="left"
      className="w-[240px] h-full py-[10px] overflow-hidden"
      motionProps={{typeof:'overlay'}}
      
    >
      <DrawerContent className="h-[95%]">
        <DrawerBody className="h-[95%]" >
        <DrawerContent className="bg-gradient-to-r from-[#ECF4FF] via-[#FFFFFF] to-[#EAE4FF] px-[10px] py-[10px] text-darkPurple">
          <div className="flex h-full w-full flex-col gap-4">
            <div className="flex h-[60px] w-full items-center justify-start border-b-1 px-[10px]">
              <Image width={63} height={16} alt="" src={purpleLogo}></Image>
            </div>
            <div className="flex h-full w-full flex-col items-start justify-between">
              <div className="flex w-full flex-col items-start justify-center gap-4 px-[10px]">
                <div
                  onClick={() => {
                    changeView("billings");
                    onOpenChange()
                  }}
                  className="flex h-[36px] w-full items-center gap-2 rounded-[5px] hover:cursor-pointer hover:bg-white"
                >
                  <CiMoneyCheck1 color="darkPurple" />
                  Facturacion
                </div>
                <div
                  onClick={() => {
                    changeView("users");
                    onOpenChange()
                  }}
                  className="flex h-[36px] w-full items-center gap-2 rounded-[5px] hover:cursor-pointer hover:bg-white"
                >
                  <LuUsers color="darkPurple" />
                  Usuarios
                </div>
                <div
                  onClick={() => {
                   changeView("roles");
                    onOpenChange()
                  }}
                  className="flex h-[36px] w-full items-center gap-2 rounded-[5px] hover:cursor-pointer hover:bg-white"
                >
                  <PiKeyLight color="darkPurple" />
                  Roles 
                </div>
                <div
                  onClick={() => {
                    changeView("permissions");
                    onOpenChange()
                  }}
                  className="flex h-[36px] w-full items-center gap-2 rounded-[5px] hover:cursor-pointer hover:bg-white"
                >
                  <BsCardChecklist color="darkPurple" />
                  Permisos
                </div>
                <div
                  onClick={() => {
                    changeView("plans");
                    onOpenChange()
                  }}
                  className="flex h-[36px] w-full items-center gap-2 rounded-[5px] hover:cursor-pointer hover:bg-white"
                >
                  <CiLock color="darkPurple" />
                  Planes
                </div>
              </div>

              <div className="flex h-[60px] w-full items-center justify-center rounded-[10px] bg-[#442F8D] text-white">
                <div className="flex w-full items-center justify-between px-4">
                  <p>Administrador</p> <FiSettings />
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </DrawerBody>
      </DrawerContent>
      
    </Drawer>
  );
}

export default Sidebar;
