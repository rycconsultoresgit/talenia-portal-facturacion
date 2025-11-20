import { Button } from "@heroui/react";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo_gradient from "../../assets/logo_gradient.png";

interface DrawerHeaderProps {
  onToggle: () => void;
}

export default function DrawerHeader({
  onToggle,
}: Readonly<DrawerHeaderProps>) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 px-3">
      <Button
        variant="light"
        isIconOnly
        radius="sm"
        size="sm"
        className="translate-y-[2px]"
        onPress={() => onToggle()}
      >
        <AiOutlineClose size={20} className="text-darkPurple" />
      </Button>

      <Image
        onClick={() => router.push("/home")}
        src={logo_gradient}
        alt="Talen-IA Logo"
        className="h-5 w-20 cursor-pointer"
      />
    </div>
  );
}
