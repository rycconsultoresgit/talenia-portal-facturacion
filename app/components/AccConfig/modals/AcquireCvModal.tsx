"use client";

import { Modal, ModalContent } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AcquireCvModal = ({ isOpen  , onClose }: Readonly<RoadmapModalProps>) => {
  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="flex min-h-[290px] h-fit flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm"
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm ",
      }}
    >
      <ModalContent
        className={`my-10 py-8 flex h-fit flex-col gap-5 bg-[url('./assets/fondoRoadmap.png')] bg-cover text-darkPurple px-10`}
      >
        <div className="w-full flex flex-col justify-center items-center gap-6">
          <p className="text-[16px] font-[600] text-[#372AAC] w-full text-start">
            Analisis Extra
          </p>
         
            <RadioGroup className="w-full ">
              <div className="flex items-center gap-2 bg-[#FFFFFF4D] px-2 w-full rounded-[5px] py-1 mx-auto">
                <Radio classNames={{control:"bg-[#372AAC] border-[#372AAC] text-[#372AAC]",hiddenInput:"bg-[#372AAC]"}} value="5"></Radio>
                <div className="flex items-center w-full justify-between">
                  <p>5 analisis de CV </p>
                  <p>$30.000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFFFF4D] px-2 w-full rounded-[5px] py-1 mx-auto ">
                <Radio classNames={{control:"bg-[#372AAC] border-[#372AAC]",hiddenInput:"bg-[#372AAC]"}} value="10"></Radio>
                <div className="flex items-center w-full justify-between">
                  <p>10 analisis de CV </p>
                  <p>$55.000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFFFF4D] px-2 w-full rounded-[5px] py-1 mx-auto">
                <Radio classNames={{control:"bg-[#372AAC] border-[#372AAC]",hiddenInput:"bg-[#372AAC]"}} value="30"></Radio>
                <div className="flex items-center w-full justify-between">
                  <p>30 analisis de CV </p>
                  <p>$130.000</p>
                </div>
              </div>
            </RadioGroup>
          
          <div className="w-full">
            <p>
            Al hacer clic en “Adquirir”, el paquete se activará 
          </p>
          <p>de forma
            automática.</p>
          </div>


          <div className="flex w-full justify-end items-center gap-2">
            <div onClick={onClose} className="flex h-[32px] w-[102px] hover:cursor-pointer items-center justify-center rounded-[5px] bg-black px-2 py-1 text-[14px] font-[500] text-white">
            Cerrar
          </div>
          <div onClick={onClose} className="flex h-[32px] w-[102px] hover:cursor-pointer items-center justify-center rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-2 py-1 text-[14px] font-[500] text-white">
            Adquirir
          </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AcquireCvModal;
