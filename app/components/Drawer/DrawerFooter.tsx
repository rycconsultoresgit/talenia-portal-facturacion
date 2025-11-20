"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { FiSettings } from "react-icons/fi";
import { RiAccountCircleLine } from "react-icons/ri";
import { CgLogOut } from "react-icons/cg";

interface DrawerFooterProps {
  username: string;
  onToggle: () => void;
  onLogout: () => void;
}

const DrawerFooter = ({
  username,
  onToggle,
  onLogout,
}: Readonly<DrawerFooterProps>) => {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleLogout = () => {
    setIsPopoverOpen(false); // Close the popover
    onLogout(); // Trigger logout from parent
  };

  const handleAccount = () => {
    setIsPopoverOpen(false); // Close the popover
    onToggle(); // Close the drawer
    router.push("/accountConfiguration");
  };

  return (
    <div className="mx-2 mb-2 flex items-center justify-between rounded-xl bg-purple p-5">
      <label className="line-clamp-1 text-base text-white">{username}</label>
      <Popover
        disableAnimation={true}
        placement="top-end"
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        showArrow={true}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            variant="light"
            radius="sm"
            className="h-8 w-8 min-w-8"
          >
            <FiSettings className="h-4 w-4 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-lg bg-white/70 p-0 shadow-md backdrop-blur-sm">
          <div className="flex flex-col gap-1 p-2">
            <button
              onClick={handleAccount}
              className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
            >
              <RiAccountCircleLine className="h-4 w-4 flex-shrink-0" />
              <p className="truncate whitespace-pre">Cuenta</p>
            </button>

            <button
              onClick={handleLogout}
              className="flex h-8 items-center gap-2 rounded-md px-2 py-1 text-sm text-darkPurple transition-colors hover:bg-purple hover:text-white"
            >
              <CgLogOut className="h-4 w-4 flex-shrink-0" />
              <p className="truncate whitespace-pre">Cerrar sesión</p>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DrawerFooter;
