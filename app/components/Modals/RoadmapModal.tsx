"use client";

import {
  Modal,
  ModalContent,
} from "@heroui/react";
import Image from "next/image";
import arpImage from "../../assets/arp-2.svg";
import ectImage from "../../assets/ect-2.svg";
import dctImage from "../../assets/dct-2.svg";
import tdlImage from "../../assets/tdl-2.svg";
import fondo from "../../assets/fondoRoadmap.png"

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoadmapModal = ({ isOpen, onClose }: Readonly<RoadmapModalProps>) => {
  return (
    <Modal
    style={{backgroundImage:`url(${fondo})`}}
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="rounded-xl bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center min-h-[460px]"
      
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm ",
      }}
    >
      <ModalContent className={` h-[360px]  text-darkPurple flex flex-col gap-5 my-10 bg-[url('./assets/fondoRoadmap.png')] bg-cover`}>
        <div className="text-[#442F8D] text-[18px] font-[600] mt-[50px]">¡Nuevos servicios en camino!</div>
        <div className="text-center text-[14px] font-[400]">
          <p>Muy pronto podrás utilizar el <b>Examen psicométrico</b>,</p> 
          <p>una nueva
          herramienta que te ayudará a conocer a tus candidatos</p>
           <p>de manera más
          completa.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full px-10">
          <div className="flex h-[72px] w-full items-center gap-2 border border-white rounded-[5px] bg-white/40 py-10 px-8 ">
            <Image src={arpImage} alt="" width={47} height={51} priority  loading="eager"/>
            <div>
              <p className="text-[#372AAC] text-[14px] font-[500]">ARP </p>
              <p className="text-[12px] font-[400]">Aprendizaje y Resolución de Problemas</p>
            </div>
          </div>
          <div className="flex h-[72px] w-full items-center gap-2 border border-white rounded-[5px] bg-white/40 py-10 px-8">
            <Image src={ectImage} alt="" width={47} height={51} priority  loading="eager"/>
            <div>
              <p className="text-[#372AAC] text-[14px] font-[500]">ECT </p>
              <p className="text-[12px] font-[400]">Estilos de Comportamiento en el Trabajo</p>
            </div>
          </div>
          <div className="flex h-[72px] w-full items-center gap-2 border border-white rounded-[5px] bg-white/40 py-10 pl-5">
            <Image src={dctImage} alt="" width={48} height={52} priority  loading="eager"/>
            <div className="w-full  flex flex-col">
              <p className="text-[#372AAC] text-[14px] font-[500]">DCT </p>
              <div className="text-[12px] font-[400] flex flex-col"><p>Desempeño y Comportamiento</p><p>en el Trabajo</p></div>
            </div>
          </div>
          <div className="flex h-[72px] w-full items-center gap-2 border border-white rounded-[5px] bg-white/40 py-10 px-8">
            <Image src={tdlImage} alt="" width={47} height={51} priority  loading="eager"/>
            <div>
              <p className="text-[#372AAC] text-[14px] font-[500]">TDL </p>
              <p className="text-[12px] font-[400]">Tipos de Liderazgo</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end px-10">
            <div onClick={onClose} className="bg-gradient-to-r from-[#384DF6] to-[#987EE6] text-white rounded-[5px] px-4 py-2 w-fit cursor-pointer"  >Entendido</div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default RoadmapModal;
