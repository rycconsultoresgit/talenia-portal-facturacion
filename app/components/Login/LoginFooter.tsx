'use client';

import Image from "next/image";
import logo_morado from "./../../assets/logo_purple.png";
import { RxRocket } from "react-icons/rx";
import { useState } from "react";
import RoadmapModal from "../Modals/RoadmapModal";

const LoginFooter = () => {
  const [isRoadmapVisible, setIsRoadmapVisible] = useState(false)
  return (
    <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-white/40 px-5 py-4 ring-1 ring-white/80 backdrop-blur-[1px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Image
            src={logo_morado}
            alt="Logo TalenIA"
            className="pointer-events-none h-fit w-16"
          />
          <a className="cursor-pointer text-base font-normal text-lightGray hover:opacity-85">
            Términos de uso
          </a>
          <a className="cursor-pointer text-base font-normal text-lightGray hover:opacity-85">
            Política de privacidad
          </a>
          <div onClick={()=>{setIsRoadmapVisible(true)}} className="cursor-pointer text-base font-normal text-darkPurple hover:opacity-85 flex items-center gap-2">
                      <RxRocket/> <p>Coming soon</p> 
                    </div>
        </div>
        <p className="text-lightGray">
          © {new Date().getFullYear()} Genesis Partners. Todos los derechos
          reservados.
        </p>
      </div>
      <RoadmapModal isOpen={isRoadmapVisible} onClose={()=>{setIsRoadmapVisible(false)}} />
    </div>
  );
};

export default LoginFooter;
