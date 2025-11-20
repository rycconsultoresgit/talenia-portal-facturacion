import { Spinner } from "@heroui/react";
import { CandidateUI } from "@/app/types/candidate.types";
import CandidateCard from "@/app/components/Candidate/Card/CandidateCard";
import EmptyState from "./EmptyState";

interface CandidateListProps {
  candidates: CandidateUI[];
  isUploading: boolean;
  hasError?: boolean;
  selectedCvs: string[];
  selectedAll: boolean;
  onAddToDelete: (id: string) => void;
  onRemoveFromDelete: (id: string) => void;
  onRetry: () => void;
  onUpload: (files: File[]) => void;
  filterCandidates?: (candidate: CandidateUI) => boolean;
  selectedCandidateId?: string | null;
  hasAnyCandidates?: boolean; // Para diferenciar entre búsqueda sin resultados vs listado vacío
}

const CandidateList = ({
  candidates,
  isUploading,
  selectedCvs,
  selectedAll,
  onAddToDelete,
  onRemoveFromDelete,
  onRetry,
  onUpload,
  filterCandidates = () => true,
  hasError = false,
  selectedCandidateId = null,
  hasAnyCandidates = false,
}: CandidateListProps) => {
  return (
    <div
      className={`gt-scroll flex w-full flex-col items-center gap-2 ${
        candidates.length > 0
          ? "h-full gap-0 overflow-x-hidden overflow-y-scroll p-4"
          : "h-full"
      }`}
    >
      <Spinner
        color="white"
        classNames={{
          circle2: "border-opacity-50 ",
          label: "text-sm text-drawerLightGray",
        }}
        label="Procesando candidatos, por favor espere ..."
        className={`py-5 transition-all duration-300 ease-in-out ${
          isUploading && candidates.length > 0 ? "flex" : "hidden"
        }`}
      />
      {candidates.length > 0 ? (
        candidates
          .filter(filterCandidates)
          .sort(
            (a, b) =>
              b.aggregatedValues.totalScore - a.aggregatedValues.totalScore,
          )
          .map((candidateUI, index) => (
            <CandidateCard
              key={candidateUI.id}
              index={index + 1}
              candidateUI={candidateUI}
              isSelectedToDelete={selectedCvs.includes(candidateUI.id)}
              addToDelete={() => onAddToDelete(candidateUI.id)}
              removeToDelete={() => onRemoveFromDelete(candidateUI.id)}
              selectedAll={selectedAll}
              isSelectedForView={selectedCandidateId === candidateUI.id}
            />
          ))
      ) : (
        <EmptyState
          isUploading={isUploading}
          hasError={hasError}
          onRetry={onRetry}
          onUpload={onUpload}
          hasAnyCandidates={hasAnyCandidates}
        />
      )}
    </div>
  );
};

export default CandidateList;
