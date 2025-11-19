import Image from "next/image";
import logo_morado from "./../../assets/logo_purple.png";
import { useState } from "react";
import RoadmapModal from "../Modals/RoadmapModal";
import { RxRocket } from "react-icons/rx";

const MainFooter = () => {
  const [isRoadmapVisible, setIsRoadmapVisible] = useState(false)
  return (
    <div className="w-full px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Image
            src={logo_morado}
            alt="Logo TalenIA"
            className="pointer-events-none h-fit w-16"
          />
          <a className="cursor-pointer text-base font-normal text-darkPurple hover:opacity-85">
            Términos de uso
          </a>
          <a className="cursor-pointer text-base font-normal text-darkPurple hover:opacity-85">
            Política de privacidad
          </a>
          <div onClick={()=>{setIsRoadmapVisible(true)}} className="cursor-pointer text-base font-normal text-darkPurple hover:opacity-85 flex items-center gap-2">
            <RxRocket/> <p>Coming soon</p> 
          </div>
        </div>
        <p className="text-darkPurple">
          © {new Date().getFullYear()} Genesis Partners. Todos los derechos
          reservados.
        </p>
      </div>
      <RoadmapModal isOpen={isRoadmapVisible} onClose={()=>{setIsRoadmapVisible(false)}} />
    </div>
  );
};

export default MainFooter;
