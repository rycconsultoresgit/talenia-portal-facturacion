"use client";

import { Spinner, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import NewRoleModal from "./modals/NewRoleModal";
import { useRolesAll } from "@/app/api/queries/rolesService";
import EditRoleModal from "./modals/EditRoleModal";
import DeleteRolModal from "./modals/DeleteRoleModal";

interface Role {
  id: string;
  name: string;
  description: string;
  permisses: string;
}

function RolesView() {
  const { rolesAll, isLoadingRoles, refetch } = useRolesAll();
  const [permissesView, setPermissesView] = useState(false);
  const [selectedRole, setSelectedRole] = useState<null | Role>(null);
  const {
    isOpen: isNewRoleOpen,
    onOpenChange: onNewRoleChange,
    onClose: onNewRoleClose,
  } = useDisclosure();
  const {
    isOpen: isEditRoleOpen,
    onOpenChange: onEditRoleChange,
    onClose: onEditRoleClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteRoleOpen,
    onOpenChange: onDeleteRoleChange,
    onClose: onDeleteRoleClose,
  } = useDisclosure();

  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">Roles</p>
          <div className="flex items-center justify-center gap-5">
            {/* <div className="flex items-center justify-center rounded-[5px] bg-white px-2">
              <BiSearch />
              <input
                className="h-[32px] w-full px-2 focus:outline-none"
                placeholder="Buscar"
              ></input>
            </div> */}
            <div
              onClick={() => {
                setPermissesView(!permissesView);
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-darkPurple px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              {permissesView ? (
                <>
                  <IoSettingsOutline /> Roles
                </>
              ) : (
                <>
                  <IoSettingsOutline /> Permisos
                </>
              )}
            </div>
            {permissesView ? (
                <div
              onClick={() => {
                onNewRoleChange();
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo permiso
            </div>
              ) : (
                <div
              onClick={() => {
                onNewRoleChange();
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo rol
            </div>
              )}
            
          </div>
        </div>
        {permissesView ? (
          <div className="mx-auto grid h-[500px] w-[1288px] grid-cols-3 grid-rows-2 justify-between gap-12 rounded-[10px] py-4">
            {[1, 2, 3, 4, 5, 6].map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex h-[180px] w-full flex-col items-center rounded-[10px] bg-[#FFFFFF80] py-2"
                >
                  <div className="flex w-[97%] items-center justify-between border-b-1 px-4 py-2">
                    <p className="text-[#372AAC]">Recurso</p>
                    <div className="hover:cursor-pointer"><IoAddCircleOutline color="#442F8D" /></div>
                  </div>
                  <div className="w-[97%] flex items-center justify-between px-4 my-2 text-[14px]">
                    <p>Permiso</p>
                    <div className="flex w-fit border px-2 py-1 rounded-[5px] items-center justify-end gap-3 bg-[#FFFFFF66]">
                      <div>
                        <FiEdit3 className="hover:cursor-pointer" color="#442F8D" />
                      </div>
                      <div>
                        <AiOutlineDelete className="hover:cursor-pointer" color="#442F8D" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto grid h-[500px] w-[1288px] grid-cols-3 gap-16 rounded-[10px] justify-between py-4 ">
            {rolesAll?.slice(0, 6).map((role: Role, index: number) => (
              <div
                key={index}
                className="flex justify-between h-[138px] w-full flex-col gap-2 rounded-[5px] bg-[#FFFFFF80] px-4 pt-2 pb-4"
              >
                <p className="border-b-1 border-b-[#FFFFFF] py-2 text-[#372AAC]">
                  {role.name}
                </p>
                <p className="text-[14px] font-[300]">{role.description}</p>
                <div className="flex w-full items-center justify-end gap-2">
                  <div
                    onClick={() => {
                      onEditRoleChange();
                      setSelectedRole(role);
                    }}
                  >
                    <FiEdit3 className="hover:cursor-pointer" />
                  </div>
                  <div
                    onClick={() => {
                      onDeleteRoleChange();
                      setSelectedRole(role);
                    }}
                  >
                    <AiOutlineDelete className="hover:cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NewRoleModal
        isOpen={isNewRoleOpen}
        onOpenChange={onNewRoleChange}
        onClose={() => {
          onNewRoleClose();
          refetch();
        }}
      ></NewRoleModal>
      <EditRoleModal
        rol={selectedRole}
        isOpen={isEditRoleOpen}
        onOpenChange={onEditRoleChange}
        onClose={() => {
          onEditRoleClose();
          setSelectedRole(null);
          refetch()
        }}
      ></EditRoleModal>
      <DeleteRolModal
        rol={selectedRole}
        isOpen={isDeleteRoleOpen}
        onOpenChange={onDeleteRoleChange}
        onClose={() => {
          onDeleteRoleClose();
          setSelectedRole(null);
          refetch();
        }}
      ></DeleteRolModal>
    </>
  );
}

export default RolesView;
