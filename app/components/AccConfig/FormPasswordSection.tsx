import { PrimaryButton } from "@/app/components/Common/Buttons";
import { Input } from "@heroui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdOutlinePassword } from "react-icons/md";

interface PasswordSectionProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    repeatPassword: string;
  };
  showPasswords: {
    current: boolean;
    new: boolean;
    repeat: boolean;
  };
  isLoading: boolean;
  onPasswordChange: (field: string, value: string) => void;
  onTogglePassword: (field: "current" | "new" | "repeat") => void;
  onSubmit: () => void;
}

export const FormPasswordSection = ({
  formData,
  showPasswords,
  isLoading,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: PasswordSectionProps) => {
  return (
    <div className="flex w-[350px] flex-col gap-5 rounded-l-xl px-14 py-8 ">
      <p className="mb-4 text-center text-xl font-semibold text-darkPurple">
        Cambiar contraseña
      </p>

      <Input
        id="currentPassword"
        label="Contraseña actual"
        labelPlacement="outside"
        type={showPasswords.current ? "text" : "password"}
        value={formData.currentPassword}
        size="md"
        classNames={{
          label: "text-sm",
          input: "focus:outline-none pl-8 pr-8",
          inputWrapper: "rounded-md p-0 w-[238px]",
        }}
        startContent={
          <MdOutlinePassword className="ml-3 h-4 w-4 text-customPurple" />
        }
        endContent={
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => onTogglePassword("current")}
          >
            {showPasswords.current ? (
              <FiEyeOff className="h-4 w-4 text-darkPurple" />
            ) : (
              <FiEye className="h-4 w-4 text-darkPurple" />
            )}
          </button>
        }
        onChange={(e) => onPasswordChange("currentPassword", e.target.value)}
        placeholder="••••••••"
      />

      <Input
        id="newPassword"
        type={showPasswords.new ? "text" : "password"}
        value={formData.newPassword}
        width={5}
        size="sm"
        label="Nueva contraseña"
        labelPlacement="outside"
        classNames={{
          label: "text-sm",
          input: "focus:outline-none pl-8 pr-8 w-[10px]",
          inputWrapper: "rounded-md p-0 w-[238px]",
        }}
        startContent={
          <MdOutlinePassword className="ml-3 h-4 w-4 text-customPurple" />
        }
        endContent={
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => onTogglePassword("new")}
          >
            {showPasswords.new ? (
              <FiEyeOff className="h-4 w-4 text-darkPurple" />
            ) : (
              <FiEye className="h-4 w-4 text-darkPurple" />
            )}
          </button>
        }
        onChange={(e) => onPasswordChange("newPassword", e.target.value)}
        placeholder="••••••••"
      />

      <Input
        id="repeatPassword"
        type={showPasswords.repeat ? "text" : "password"}
        value={formData.repeatPassword}
        label="Repetir nueva contraseña"
        labelPlacement="outside"
        size="md"
        classNames={{
          label: "text-sm",
          input: "focus:outline-none pl-8 pr-8",
          inputWrapper: "rounded-md p-0 w-[238px]",
        }}
        startContent={
          <MdOutlinePassword className="ml-3 h-4 w-4 text-customPurple" />
        }
        endContent={
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => onTogglePassword("repeat")}
          >
            {showPasswords.repeat ? (
              <FiEyeOff className="h-4 w-4 text-darkPurple" />
            ) : (
              <FiEye className="h-4 w-4 text-darkPurple" />
            )}
          </button>
        }
        onChange={(e) => onPasswordChange("repeatPassword", e.target.value)}
        placeholder="••••••••"
      />

      <PrimaryButton
        label="Guardar"
        onClick={onSubmit}
        className="ms-auto mt-4 w-fit"
        disabled={
          isLoading ||
          (!formData.currentPassword &&
            !formData.newPassword &&
            !formData.repeatPassword)
        }
      />
    </div>
  );
};
