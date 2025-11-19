"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import logo_blanco from "../../assets/logo_white.webp";
import { useAuth } from "@/app/context/AuthContext";
import { useCvQuota } from "@/app/context/CvQuotaContext";
import CvQuotaDisplay from "../Layout/CvQuotaDisplay";

interface NavbarProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

const TaleniaNavbar = ({
  isDrawerOpen,
  onToggleDrawer,
}: Readonly<NavbarProps>) => {
  const router = useRouter();
  const { userId } = useAuth();
  const { refreshTrigger } = useCvQuota();

  return (
    <div className="relative w-full rounded-xl bg-gradient-to-r from-customPurple to-taleniaBlue px-5 py-4">
      {/* Overlay with backdrop filter effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[#251D3F]/80" />

      <div className="relative z-10 flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="light"
            isIconOnly
            size="md"
            onPress={onToggleDrawer}
            className="rounded-md"
            aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isDrawerOpen ? (
              <AiOutlineClose size={28} className="text-white" />
            ) : (
              <BiMenu size={28} className="translate-y-[1px] text-white" />
            )}
          </Button>

          <Image
            src={logo_blanco}
            alt="Talen-IA Logo"
            className="h-5 w-20 cursor-pointer"
            quality={100}
            onClick={() => router.push("/home")}
          />
        </div>

        {/* CV Quota Display */}
        {userId > 0 && (
          <CvQuotaDisplay userId={userId} refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
};

export default TaleniaNavbar;
