"use client";

import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { userService } from "@/app/api/userService";
import { TbPointFilled } from "react-icons/tb";
import { IoAddCircleOutline } from "react-icons/io5";

interface User {
  nombre: string;
  rut: string;
  email: string;
  empresa: string;
  plan: string;
  rol: string;
}

function UsersView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(10);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await userService.getAllUsers();
      setIsLoading(false);
      setUsers(data);
    };
    getData();
  }, []);

  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">Usuarios</p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <input
                className="h-[32px] w-full px-2"
                placeholder="Buscar"
              ></input>
            </div>
            <div
              onClick={() => {
                console.log("Modal nuevo");
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo usuario
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-[500px] w-full flex-col items-center justify-center gap-2 overflow-scroll rounded-[10px] bg-[#FFFFFF66] px-4 py-4">
            <Spinner></Spinner>
          </div>
        ) : (
          <div className="mx-auto flex h-[500px] w-[1288px] flex-col items-center gap-2 rounded-[10px] bg-[#FFFFFF66] px-3 py-4">
            <div className="grid h-[50px] w-full grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_1fr] place-items-start items-center gap-4 rounded-[5px] bg-[#FFFFFF66] px-8 text-[16px] font-[500] text-[#442F8D]">
              <div className="w-full">Nombre</div>
              <div className="w-full">Rut</div>
              <div className="w-full">Email</div>
              <div className="w-full">Empresa</div>
              <div className="w-full">Plan</div>
              <div className="w-full">Rol</div>
              <div className="w-full">Acciones</div>
            </div>

            {users.map((user: User, index) => (
              <div
                key={index}
                className="grid h-[50px] w-[1288px] grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_1fr] place-items-start items-center gap-4 px-8"
              >
                <div className="flex w-full items-center gap-2">
                  <TbPointFilled color="green" />
                  {user.nombre}
                </div>
                <div className="w-full">{user.rut}</div>
                <div className="w-full">{user.email}</div>
                <div className="w-full">{user.empresa}</div>
                <div className="w-full">{user.plan}</div>
                <div className="w-full">{user.rol}</div>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => {
                      console.log("Modal de edicion");
                    }}
                  >
                    <FiEdit3 />
                  </div>
                  <div
                    onClick={() => {
                      console.log("Modal de eliminacion");
                    }}
                  >
                    <AiOutlineDelete />
                  </div>
                </div>
              </div>
            ))}
            <div></div>
          </div>
        )}

        <div className="mx-auto flex w-[1288px] items-center justify-end">
          <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#FFFFFF66] px-2 py-2">
            <IoIosArrowBack />
            {currentPage} de {total}
            <IoIosArrowForward />
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersView;
