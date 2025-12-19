"use client";

import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useUsersAll } from "@/app/api/queries/userService";
import { Spinner, useDisclosure } from "@heroui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { TbPointFilled } from "react-icons/tb";
import { IoAddCircleOutline } from "react-icons/io5";
import NewUserModal from "./modals/NewUserModal";
import EditUserModal from "./modals/EditUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";

interface User {
  username: string;
  rut: string;
  email: string;
  plan: {name:string};
  role: {id:number, name:string};
  dv: number;
  company?: {name:string};
}

function UsersView() {
  const LIMIT = 6
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const {
    isOpen: newUserIsOpen,
    onOpenChange: newUserOnOpenChange,
    onClose: newUserClose,
  } = useDisclosure();
  const {
    isOpen: editUserIsOpen,
    onOpenChange: editUserOnOpenChange,
    onClose: editUserClose,
  } = useDisclosure();
  const {
    isOpen: deleteUserIsOpen,
    onOpenChange: deleteUserOnOpenChange,
    onClose: deleteUserClose,
  } = useDisclosure();

  const {
    usersAll,
    refetch: refetchUsers,
    totalUsers,isLoadingUsers
  } = useUsersAll({ page: currentPage, limit: LIMIT });
  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF80] to-[#D9CEFF80] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">Usuarios</p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-[32px] w-full items-center gap-2 rounded-[5px] bg-white px-3 focus:outline-none">
                <BiSearch color="#CACCFD" />
                <input
                  className="focus:outline-none"
                  placeholder="Buscar"
                ></input>
              </div>
            </div>
            <div
              onClick={() => {
                newUserOnOpenChange();
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo usuario
            </div>
          </div>
        </div>
        { isLoadingUsers ? (
          <div className="flex h-[500px] w-full flex-col items-center justify-center gap-2 overflow-scroll rounded-[10px] bg-[#FFFFFF66] px-4 py-4">
            <Spinner></Spinner>
          </div>
        ) : (
          <div className="mx-auto flex h-[500px] w-[1288px] flex-col items-center gap-2 rounded-[10px] bg-[#FFFFFF66] px-3 py-4">
            <div className="grid h-[50px] w-full grid-cols-[1.25fr_1fr_1.75fr_1.3fr_0.7fr_1fr_1fr] place-items-start items-center gap-4 rounded-[5px] bg-[#FFFFFF66] px-8 text-[16px] font-[500] text-[#442F8D]">
              <div className="w-full">Nombre</div>
              <div className="w-full">Rut</div>
              <div className="w-full">Email</div>
              <div className="w-full">Empresa</div>
              <div className="w-full">Plan</div>
              <div className="w-full">Rol</div>
              <div className="w-full">Acciones</div>
            </div>

            {usersAll?.slice(0, 7).map((user: User, index:number) => (
              <div
                key={index}
                className="grid h-[50px] w-[1288px] grid-cols-[1.25fr_1fr_1.75fr_1.3fr_0.7fr_1fr_1fr] place-items-start items-center gap-4 px-8"
              >
                <div className="flex w-full items-center gap-1 overflow-hidden text-ellipsis text-start">
                  <TbPointFilled color="green" />
                  <p className="w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.username}
                  </p>
                </div>
                <div className="w-full">
                  {user.rut}-{user.dv}
                </div>
                <div className="w-full overflow-hidden text-ellipsis text-start">
                  {user.email}
                </div>
                <div className="w-full text-nowrap text-ellipsis overflow-hidden">{user.company.name}</div>
                <div className="w-full">{user.plan.name}</div>
                <div className="w-full">{user.role.name}</div>
                <div className="flex items-center gap-3">
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setEditingUser(user);
                      editUserOnOpenChange();
                    }}
                  >
                    <FiEdit3 />
                  </div>
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setEditingUser(user);
                      deleteUserOnOpenChange();
                    }}
                  >
                    <AiOutlineDelete />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        { Math.round(totalUsers / LIMIT ) > 0 ? (
          <div className="mx-auto flex w-[1288px] items-center justify-end">
            <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#FFFFFF66] px-2 py-2 text-darkPurple">
              <div
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    refetchUsers();
                  }
                }}
              >
                <IoIosArrowBack className="hover:cursor-pointer" />
              </div>
              {currentPage} de
              {Math.round(totalUsers / 6)}
              <div
                onClick={() => {
                  if (currentPage < Math.round(totalUsers / 6)) {
                    setCurrentPage(currentPage + 1);
                    refetchUsers();
                  }
                }}
              >
                <IoIosArrowForward className="hover:cursor-pointer" />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <NewUserModal
        isOpen={newUserIsOpen}
        onOpenChange={newUserOnOpenChange}
        onClose={() => {
          newUserClose();
          refetchUsers();
        }}
      ></NewUserModal>
      <EditUserModal
        user={editingUser}
        isOpen={editUserIsOpen}
        onOpenChange={editUserOnOpenChange}
        onClose={() => {
          editUserClose();
          setEditingUser(null)
          refetchUsers();
        }}
      ></EditUserModal>
      <DeleteUserModal
        user={editingUser}
        isOpen={deleteUserIsOpen}
        onOpenChange={deleteUserOnOpenChange}
        onClose={() => {
          deleteUserClose();
          setEditingUser(null)
          refetchUsers();
        }}
      ></DeleteUserModal>
    </>
  );
}

export default UsersView;
