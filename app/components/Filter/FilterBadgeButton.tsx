"use client";

import useFilterCounter from "@/app/hooks/useFilterCounter";
import { FiltersInterface } from "@/app/types/filters";
import { MdFilterListOff } from "react-icons/md";

type FilterButtonProps = {
  activeFilters: FiltersInterface;
  onDeleteClick: (e: React.MouseEvent) => void;
  isDisabled?: boolean;
};

export const FilterBadgeButton = ({
  activeFilters,
  onDeleteClick,
  isDisabled = false,
}: FilterButtonProps) => {
  const { countActiveFilters } = useFilterCounter(activeFilters);

  const count = countActiveFilters();

  return (
    <button
      className={`relative flex w-fit items-center justify-center rounded-md bg-lightGray px-4 py-[12px] ${isDisabled ? "pointer-events-none cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
      onClick={onDeleteClick}
      disabled={isDisabled}
    >
      <MdFilterListOff className="text-white" />
      {count > 0 && (
        <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
};
