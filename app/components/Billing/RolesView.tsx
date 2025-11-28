"use client";

import { Spinner, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { userService } from "@/app/api/userService";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import NewRoleModal from "./modals/NewRoleModal";

interface User {
  nombre: string;
  rut: string;
  email: string;
  empresa: string;
  plan: string;
  rol: string;
}

function RolesView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(10);
  const [roles, setRoles] = useState([]);
  const {
    isOpen: isNewRoleOpen,
    onOpenChange: onNewRoleChange,
    onClose: onNewRoleClose,
  } = useDisclosure();

  useEffect(() => {
    const getData = async () => {
      const data = await userService.getAllRoles();
      setIsLoading(false);
      setRoles(data);
    };
    getData();
  }, []);

  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">Roles</p>
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center justify-center rounded-[5px] bg-white px-2">
              <BiSearch />
              <input
                className="h-[32px] w-full px-2 focus:outline-none"
                placeholder="Buscar"
              ></input>
            </div>
            <div className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-darkPurple px-4 text-[14px] font-[500] text-white hover:cursor-pointer">
              <IoSettingsOutline /> Permisos
            </div>
            <div
              onClick={() => {
                onNewRoleChange();
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo rol
            </div>
          </div>
        </div>
        <div className="mx-auto grid h-[500px] w-[1288px] grid-cols-3 gap-2 rounded-[10px] py-4">
          {roles.slice(0, 9).map((role, index) => (
            <div
              key={index}
              className="flex h-[138px] w-[300px] flex-col justify-between gap-2 rounded-[5px] bg-[#FFFFFF80] px-4 py-4"
            >
              <p className="border-b-1 border-b-[#FFFFFF] py-2 text-[#372AAC]">
                {role.name}
              </p>
              <p className="text-[14px] font-[300]">{role.description}</p>
              <div className="flex w-full items-center justify-end gap-2">
                <FiEdit3 className="hover:cursor-pointer" />
                <AiOutlineDelete className="hover:cursor-pointer"/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewRoleModal
        isOpen={isNewRoleOpen}
        onOpenChange={onNewRoleChange}
        onClose={onNewRoleClose}
      ></NewRoleModal>
    </>
  );
}

export default RolesView;
