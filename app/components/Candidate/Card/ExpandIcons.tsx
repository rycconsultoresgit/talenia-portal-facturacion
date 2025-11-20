import { IoIosArrowDown } from "react-icons/io";

const ExpandArrowIcon = ({
  isExpanded,
  className = "",
}: {
  isExpanded: boolean;
  className?: string;
}) => {
  return (
    <IoIosArrowDown
      className={`h-5 w-5 flex-shrink-0 cursor-pointer rounded-lg p-1 text-customPurple transition-all duration-300 hover:bg-lightPurple ${
        isExpanded ? "rotate-180" : ""
      } ${className}`}
    />
  );
};

const ExpandArrowIconHeader = ({
  isExpanded,
  className = "",
}: {
  isExpanded: boolean;
  className?: string;
}) => {
  return (
    <IoIosArrowDown
      className={`h-3 w-3 flex-shrink-0 text-customPurple transition-transform duration-200 ${
        isExpanded ? "rotate-180" : ""
      } ${className}`}
    />
  );
};

export { ExpandArrowIcon, ExpandArrowIconHeader };
