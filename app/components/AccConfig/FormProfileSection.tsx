import { PrimaryButton } from "@/app/components/Common/Buttons";
import { Input } from "@heroui/react";
import { AiOutlineUser } from "react-icons/ai";
import { GoMail } from "react-icons/go";

interface ProfileSectionProps {
  formData: {
    userName: string;
    email: string;
  };
  isLoading: boolean;
  onProfileChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const FormProfileSection = ({
  formData,
  isLoading,
  onProfileChange,
  onSubmit,
}: ProfileSectionProps) => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-l-xl px-11 py-8">
      <p className="mb-4 text-center text-xl font-semibold text-darkPurple">
        Datos personales
      </p>

      <Input
        id="userName"
        type="text"
        label="Nombre de usuario"
        labelPlacement="outside"
        size="md"
        classNames={{
          label: "text-sm",
          input: "focus:outline-none text-darkPurple pl-8 pr-8",
          inputWrapper: "rounded-md p-0",
        }}
        startContent={
          <AiOutlineUser className="ml-3 h-4 w-4 text-customPurple" />
        }
        value={formData.userName}
        onChange={(e) => onProfileChange("userName", e.target.value)}
        placeholder="Ingresa tu nombre de usuario"
      />

      <Input
        id="email"
        type="email"
        label="Correo electrónico"
        labelPlacement="outside"
        size="md"
        classNames={{
          label: "text-sm ",
          input: "focus:outline-none text-darkPurple pl-8 pr-8",
          inputWrapper: "rounded-md p-0",
        }}
        startContent={<GoMail className="ml-3 h-4 w-4 text-customPurple" />}
        value={formData.email}
        onChange={(e) => onProfileChange("email", e.target.value)}
        placeholder="Ingresa tu correo electrónico"
      />

      <PrimaryButton
        label="Guardar"
        onClick={onSubmit}
        className="ms-auto mt-auto w-fit"
        disabled={isLoading || (!formData.userName && !formData.email)}
      />
    </div>
  );
};
