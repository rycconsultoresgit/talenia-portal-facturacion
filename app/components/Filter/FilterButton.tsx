import { LuListFilter } from "react-icons/lu";
import { SecondaryButton } from "../Common/Buttons";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
  isDisabled: boolean;
}

export const FilterButton = ({
  onClick,
  className = "",
  isDisabled = false,
}: FilterButtonProps) => {
  return (
    <SecondaryButton
      label="Filtros"
      icon={LuListFilter}
      onClick={isDisabled ? undefined : onClick}
      className={`${className} py-[10px] ${isDisabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
      disabled={isDisabled}
    />
  );
};
