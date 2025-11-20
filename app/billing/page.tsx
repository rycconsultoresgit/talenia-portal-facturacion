"use client";

import React, { useState } from "react";
import MainContainer from "../components/Common/MainContainer";
import login_bg from "../assets/login_container_bg.png";
import MainFooter from "../components/Common/MainFooter";
import { BiMenu } from "react-icons/bi";
import logo from "../assets/logo_white.webp";
import purpleLogo from "../assets/logo_purple.png";
import Image from "next/image";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Select, SelectItem } from "@heroui/select";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/drawer";
import { useDisclosure } from "@heroui/react";
import { CiLock, CiMoneyCheck1 } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { PiKeyLight } from "react-icons/pi";
import { BsCardChecklist } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";

function BillingPanel() {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(10);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const billingData = [
    {
      name: "Ricardo Arancibia",
      detail: "Mensualidad diciembre",
      pay: 80000,
      extraAnalisys: 12400,
      date: "23/07/2018",
      status: "Pagado",
    },
    {
      name: "Ricardo Arancibia",
      detail: "Mensualidad diciembre",
      pay: 80000,
      extraAnalisys: 12400,
      date: "23/07/2018",
      status: "Pagado",
    },
    {
      name: "Ricardo Arancibia",
      detail: "Mensualidad diciembre",
      pay: 80000,
      extraAnalisys: 12400,
      date: "23/07/2018",
      status: "Pagado",
    },
  ];

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return (
    <>
      <div className="relative min-h-screen w-full select-none justify-center overflow-hidden bg-purple">
        <MainContainer isLoginPage={false} src={login_bg}>
          <div className="z-20 flex w-full flex-col items-center justify-between text-darkPurple">
            <div className="flex h-[60px] w-full items-center gap-5 rounded-lg bg-[#251D3FCC] px-5">
              <div
                onClick={() => {
                  onOpen();
                }}
              >
                <BiMenu color="white" size={20} />
              </div>

              <Image width={63} height={16} alt="" src={logo}></Image>
            </div>
            <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
              <div className="flex h-[32px] w-full items-center justify-between rounded-lg px-2">
                <p className="text-[18px] font-[500] text-[#645790]">
                  Panel de facturacion
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <Select
                        placeholder="Dic"
                        className="text-[#645790]"
                        classNames={{
                          innerWrapper: "text-[#645790]",
                          value:
                            "text-[#645790] group-data-[has-value=true]:text-[#645790] ",
                          base: " w-[82px] h-[32px] rounded-[5px] text-[#645790] bg-[#FFFFFF66] ",
                          helperWrapper: "text-[#645790]",
                          listbox: "bg-white text-[#645790]",
                          listboxWrapper: "text-[#645790]",
                          mainWrapper: "text-[#645790]",
                          popoverContent:
                            "bg-white w-[82px] rounded-[5px] p-0 text-[#645790]",
                          selectorIcon: "text-[#645790]",
                          spinner: "text-[#645790]",
                          trigger:
                            "bg-[#FFFFFF66] rounded-[5px] data-[hover=true]:bg-[#FFFFFF66] text-[#645790] min-h-[32px] h-[10px] py-0",
                          description: "text-[#645790]",
                          errorMessage: "text-[#645790]",
                          label: "text-[#645790]",
                        }}
                      >
                        {[
                          "Ene",
                          "Feb",
                          "Mar",
                          "Abr",
                          "May",
                          "Jun",
                          "Jul",
                          "Ago",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dic",
                        ].map((month, index) => (
                          <SelectItem key={index}>{month}</SelectItem>
                        ))}
                      </Select>

                      <Select
                        placeholder="2025"
                        className="text-darkPurple"
                        classNames={{
                          innerWrapper: "",
                          value: "",
                          base: "bg-[#FFFFFF66] w-[92px] h-[32px] rounded-[5px] text-darkPurple",
                          helperWrapper: "",
                          listbox: "bg-white text-darkPurple",
                          listboxWrapper: "",
                          mainWrapper: "",
                          popoverContent:
                            "bg-white w-[92px] rounded-[5px] p-0 text-darkPurple",
                          selectorIcon: "",
                          spinner: "",
                          trigger:
                            "bg-[#FFFFFF66] rounded-[5px] data-[hover=true]:bg-[#FFFFFF66] text-[#645790] min-h-[32px] h-[10px] py-0",
                        }}
                      >
                        {["2025"].map((month, index) => (
                          <SelectItem key={index}>{month}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <input
                      className="h-[32px] w-full px-2"
                      placeholder="Buscar"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="flex h-[500px] w-full flex-col gap-2 overflow-scroll rounded-[10px] bg-[#FFFFFF66] px-4 py-4">
                <div className="grid h-[50px] w-full grid-cols-[1fr_1.25fr_1fr_1fr_1fr_1fr_0.5fr] place-items-start items-center rounded-[5px] bg-[#FFFFFF66] px-4 text-[16px] font-[500] text-[#442F8D]">
                  <div className="w-full">Cliente</div>
                  <div className="w-full">Detalle</div>
                  <div className="w-full">Pago plan</div>
                  <div className="w-full">Analisis extra</div>
                  <div className="w-full">Total pago</div>
                  <div className="w-full">Fecha de pago</div>
                  <div className="w-full">Estado</div>
                </div>

                {billingData.map((bill, index) => (
                  <div
                    key={index}
                    className="grid h-[50px] w-full grid-cols-[1fr_1.25fr_1fr_1fr_1fr_1fr_0.5fr] place-items-start items-center px-4"
                  >
                    <div className="w-full">{bill.name}</div>
                    <div className="w-full">{bill.detail}</div>
                    <div className="w-full">{moneyParser(bill.pay)} CLP</div>
                    <div className="flex w-full items-center gap-2">
                      <div>{moneyParser(bill.extraAnalisys)} CLP</div>{" "}
                      <div
                        onClick={() => {
                          console.log("Abriendo modal");
                        }}
                      >
                        <AiOutlineInfoCircle color="#947CE7" />
                      </div>
                    </div>
                    <div className="w-full">
                      {moneyParser(bill.pay + bill.extraAnalisys)} CLP
                    </div>
                    <div className="w-full">{bill.date}</div>
                    <div className="w-full">{bill.status}</div>
                  </div>
                ))}
                <div></div>
              </div>
              <div className="flex w-full items-center justify-end px-2">
                <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#FFFFFF66] px-2 py-2">
                  <IoIosArrowBack />
                  {currentPage} de {total}
                  <IoIosArrowForward />
                </div>
              </div>
            </div>
            <MainFooter></MainFooter>
          </div>
        </MainContainer>
      </div>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        className="w-[240px]"
      >
        <DrawerBody>
          <DrawerContent className="px-[10px] py-[10px] text-darkPurple bg-gradient-to-r from-[#ECF4FF] via-[#FFFFFF] to-[#EAE4FF]">
            <div className="w-full h-full flex flex-col gap-4 ">
              <div className="flex h-[60px] w-full items-center justify-start border-b-1 px-[10px]">
                <Image width={63} height={16} alt="" src={purpleLogo}></Image>
              </div>
              <div className="w-full h-full flex flex-col justify-between items-start">
                <div className="flex flex-col w-full items-start justify-center gap-4  px-[10px]">
                
                <div className="w-full flex items-center gap-2 h-[36px] hover:bg-white hover:cursor-pointer rounded-[5px] "><CiMoneyCheck1 color="darkPurple"/>Facturacion</div>
                <div className="w-full flex items-center gap-2 h-[36px] hover:bg-white hover:cursor-pointer rounded-[5px] "><LuUsers color="darkPurple"/>Usuarios</div>
                <div className="w-full flex items-center gap-2 h-[36px] hover:bg-white hover:cursor-pointer rounded-[5px] "><PiKeyLight  color="darkPurple"/>Roles y permisos</div>
                <div className="w-full flex items-center gap-2 h-[36px] hover:bg-white hover:cursor-pointer rounded-[5px] "><BsCardChecklist  color="darkPurple"/>Planes</div>
                <div className="w-full flex items-center gap-2 h-[36px] hover:bg-white hover:cursor-pointer rounded-[5px] "><CiLock  color="darkPurple"/>Seguridad</div>
              </div>

              <div className="bg-[#442F8D] w-full h-[60px] rounded-[10px] text-white flex justify-center items-center">
                <div className="w-full flex items-center justify-between px-4"><p>Administrador</p> <FiSettings /></div>
              </div>
              </div>
              
            </div>
          </DrawerContent>
        </DrawerBody>
      </Drawer>
    </>
  );
}

export default BillingPanel;
