import { Button } from "@heroui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { IoClose } from "react-icons/io5";

const PrimaryButton = ({
  label,
  onClick,
  className,
  disabled,
  icon: Icon,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  icon?: IconType;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex cursor-pointer flex-row items-center justify-center gap-1 rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:opacity-85 ${className}`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
};

const SecondaryButton = ({
  label,
  onClick,
  className,
  disabled,
  icon: Icon,
  iconSize = 14,
  imageNode,
  withDot = false,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  icon?: IconType;
  iconSize?: number;
  imageNode?: ReactNode;
  withDot?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-darkPurple px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:opacity-85 ${className}`}
      disabled={disabled}
    >
      {Icon && <Icon size={iconSize} />}
      {imageNode}
      {label}
      {withDot && (
        <span className="absolute -top-1 right-2 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

const CloseModalButton = ({
  onClick,
  className,
  isLoading,
}: {
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <Button
      isIconOnly
      variant="light"
      radius="full"
      size="sm"
      onPress={onClick}
      className="h-7 w-7 min-w-0 text-darkPurple data-[hover]:bg-white/80"
      isDisabled={isLoading}
    >
      <IoClose className={`${className} text-base`} />
    </Button>
  );
};

export { PrimaryButton, SecondaryButton, CloseModalButton };
