"use client";

import React from "react";
import MainContainer from "../components/Common/MainContainer";
import login_bg from "../assets/login_container_bg.png";
import MainFooter from "../components/Common/MainFooter";
import { BiMenu } from "react-icons/bi";
import logo from "../assets/logo_white.webp";
import Image from "next/image";
import { useDisclosure } from "@heroui/react";
import Sidebar from "../components/Billing/Sidebar";
import BillingView from "../components/Billing/BillingView";

function BillingPanel() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
            <BillingView></BillingView>
            <MainFooter></MainFooter>
          </div>
        </MainContainer>
      </div>
      <Sidebar isOpen={isOpen} onOpenChange={onOpenChange}></Sidebar>
      
    </>
  );
}

export default BillingPanel;
