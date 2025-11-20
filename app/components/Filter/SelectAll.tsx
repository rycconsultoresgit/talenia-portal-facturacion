import { Checkbox } from "@heroui/react";
import { FiTrash } from "react-icons/fi";
import { CandidateUI } from "@/app/types/candidate.types";

interface SelectAllProps {
  selectedAll: boolean;
  setSelectedAll: (value: boolean) => void;
  selectedCvs: string[];
  setSelectedCvs: (value: string[]) => void;
  setIsDeleteModalOpen: (value: boolean) => void;
  isDisabled?: boolean;
  allCandidates: CandidateUI[];
}

export const SelectAll = ({
  selectedAll,
  setSelectedAll,
  selectedCvs,
  setSelectedCvs,
  setIsDeleteModalOpen,
  isDisabled = false,
  allCandidates,
}: SelectAllProps) => {
  const handleSelectAllChange = () => {
    if (selectedAll) {
      setSelectedAll(false);
      setSelectedCvs([]);
    } else {
      setSelectedAll(true);
      setSelectedCvs(allCandidates.map((candidate) => candidate.id));
    }
  };

  return (
    <div className="flex flex-row items-center rounded-lg p-2 transition-all duration-400">
      <Checkbox
        size="md"
        color="secondary"
        classNames={{
          label: "font-medium text-sm",
          wrapper: "border-purple before:border-purple",
        }}
        isSelected={selectedAll}
        isDisabled={isDisabled}
        onValueChange={handleSelectAllChange}
      >
        Seleccionar todo
      </Checkbox>
      {!isDisabled && (
        <div
          className={`flex items-center overflow-hidden transition-all duration-400 ${
            selectedAll || selectedCvs.length > 0 ? "max-w-[200px]" : "max-w-0"
          }`}
        >
          <span className="mx-2">|</span>
          <div
            className="transition-all duration-400 hover:cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <FiTrash className="text-purple" />
          </div>
        </div>
      )}
    </div>
  );
};
