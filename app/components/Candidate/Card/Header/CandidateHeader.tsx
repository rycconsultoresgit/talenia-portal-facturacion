import { CandidateUI, Education } from "@/app/types/candidate.types";
import { Checkbox } from "@heroui/react";
import CandidateRecommendation from "./CandidateRecommendation";
import Separator from "./Separator";
import { capitalize } from "@/app/utils/string.utils";
import { formatSalaryToCLP } from "@/app/utils/salary.utils";
import { candidateService } from "@/app/api/candidateService";
import { useState } from "react";
import { toast } from "sonner";

interface CandidateHeaderProps {
  isExpanded: boolean;
  selectedAll: boolean;
  isSelectedToDelete: boolean;
  candidateUI: CandidateUI; // You might want to create a proper type for this
  index: number;
  addToDelete: (id: string, index: number) => void;
  removeToDelete: (id: string, index: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  getHighestEducation: (education: Education[]) => string; // You might want to properly type this
}

export default function CandidateHeader({
  isExpanded,
  selectedAll,
  isSelectedToDelete,
  candidateUI,
  index,
  addToDelete,
  removeToDelete,
  setIsExpanded,
  getHighestEducation,
}: Readonly<CandidateHeaderProps>) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectionChange = async (isSelected: boolean) => {
    try {
      setIsUpdating(true);
      await candidateService.updateCandidate(candidateUI.id, {
        candidate: {
          selected: isSelected,
        },
      });

      // Actualizar el estado local
      if (isSelected) {
        addToDelete(candidateUI.id, index - 1);
      } else {
        removeToDelete(candidateUI.id, index - 1);
      }
    } catch (error) {
      console.error("Error al actualizar la selección del candidato:", error);
      toast.error("Error al actualizar la selección del candidato");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div
      className="w-full flex-shrink-0 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex w-full flex-row justify-center">
        <div
          className={`flex min-w-7 flex-shrink-0 flex-col items-center justify-center gap-2 bg-[#573CC6]/50 px-2 py-3 transition-all duration-300 ease-in-out ${!isExpanded ? "rounded-l-xl" : "rounded-tl-xl"}`}
        >
          <Checkbox
            size="md"
            radius="sm"
            color="secondary"
            className="m-0 inline-flex translate-x-1 items-center justify-center p-0"
            isSelected={isSelectedToDelete}
            isDisabled={selectedAll || isUpdating}
            onValueChange={(isSelected) => {
              if (selectedAll) return;
              handleSelectionChange(isSelected);
            }}
          />
          <p className="cursor-pointer text-sm text-white">{index}</p>
        </div>

        <div className="w-1/6 min-w-0 px-4 py-3">
          <div className="flex flex-col">
            <span className="truncate text-sm font-bold text-purple">
              {capitalize(candidateUI.name)}
            </span>
            <span className="truncate text-sm font-light text-lightGray">
              {capitalize(candidateUI.title)}
            </span>
            <span className="truncate text-sm font-medium text-purple">
              Renta: {formatSalaryToCLP(candidateUI.salaryExpectation)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="w-1/12 min-w-0 px-2 py-3">
          <div className="flex flex-col">
            <span className="truncate text-sm font-bold text-purple">
              {candidateUI.experience}
            </span>
            <span className="text-sm font-light text-lightGray">
              de experiencia
            </span>
          </div>
        </div>

        <Separator />

        <div className="min-w-0 flex-1 px-2 py-3">
          <div className="flex flex-col">
            <h3 className="truncate text-sm font-bold text-purple">
              Ubicación
            </h3>

            <div className="space-y-1">
              <p className="line-clamp-1 text-sm font-light text-lightGray">
                <span>Dirección:</span>{" "}
                {candidateUI.address || "No determinado"}
              </p>

              <p className="flex items-center gap-1 text-sm font-light text-lightGray">
                <span>Reubicable:</span>
                <span
                  className={`${
                    ["Sí", "No"].includes(
                      capitalize(candidateUI.willingToRelocate) || "",
                    )
                      ? "font-semibold text-purple"
                      : "text-lightGray"
                  }`}
                >
                  {candidateUI.willingToRelocate || "No especificado"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="w-1/12 min-w-0 px-2 py-3">
          <div className="flex flex-col">
            <span className="truncate text-sm font-[700] text-purple">
              Nivel de educación
            </span>
            <span className="truncate text-sm font-light text-lightGray">
              {getHighestEducation(candidateUI.education)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="min-w-0 flex-1 px-2 py-3">
          <div className="flex flex-col">
            <span className="truncate text-sm font-[700] text-purple">
              Habilidades técnicas
            </span>
            <span className="line-clamp-2 text-wrap text-sm font-light text-lightGray">
              {candidateUI.skills.technical.join(", ") || "No determinado"}
            </span>
          </div>
        </div>

        <Separator />

        <CandidateRecommendation
          recommendation={candidateUI.recommendation}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}
