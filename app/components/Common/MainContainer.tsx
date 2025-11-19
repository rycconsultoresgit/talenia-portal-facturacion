import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface MainContainerProps {
  src: StaticImageData;
  isLoginPage: boolean;
  children: ReactNode;
}

const MainContainer = ({
  src,
  children,
  isLoginPage = false,
}: Readonly<MainContainerProps>) => {
  return (
    <div className="flex h-full min-h-screen p-5">
      <div className="relative z-10 flex w-full flex-1 overflow-hidden rounded-2xl p-2">
        {/* Gradiente de fondo */}
        <div
          className={`absolute inset-0 z-0 rounded-2xl ${isLoginPage ? "bg-gradient-to-tr from-white/60 to-[#D9CEFF]/40" : "bg-gradient-to-t from-white/30 to-[#D9CEFF]/50"} backdrop-blur-sm`}
        />
        {/* Main Card background */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Image
            src={src}
            alt="Fondo contenedor"
            fill
            priority={true}
            quality={100}
            className="pointer-events-none rounded-lg object-cover opacity-70"
          />
        </div>

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
