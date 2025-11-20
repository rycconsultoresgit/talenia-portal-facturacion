"use client";

import { useState, useEffect } from "react";
import MoreTechnologiesModal from "../../Modals/MoreTechnologiesModal";
import { CandidateUI } from "@/app/types/candidate.types";
import { getHighestEducation } from "@/app/utils/candidate.utils";
import CandidateHeader from "./Header/CandidateHeader";
import CandidateContent from "./Content/CandidateContent";
import BriefAnalysisModal from "../../Modals/BriefAnalysisModal";

interface CandidateCardProps {
  index: number;
  candidateUI: CandidateUI;
  className?: string;
  isSelectedToDelete: boolean;
  addToDelete: (id: string, index: number) => void;
  removeToDelete: (id: string, index: number) => void;
  selectedAll?: boolean;
  isSelectedForView?: boolean;
  // reload: any;
}

const CandidateCard = ({
  index,
  candidateUI,
  className = "",
  isSelectedToDelete,
  addToDelete,
  removeToDelete,
  selectedAll,
  isSelectedForView = false,
}: CandidateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(isSelectedForView);
  const [isVisibleBriefAnalysis, setIsVisibleBriefAnalysis] = useState(false);
  const [isVisibleAllTechnologies, setIsVisibleAllTechnologies] =
    useState(false);

  // Efecto para manejar cambios en isSelectedForView
  useEffect(() => {
    if (isSelectedForView) {
      setIsExpanded(true);
    }
  }, [isSelectedForView]);

  return (
    <div
      id={`candidate-${candidateUI.id}`}
      className={`flex h-fit w-full flex-shrink-0 flex-col rounded-xl bg-white/30 backdrop-blur-sm ${className}`}
    >
      <CandidateHeader
        isExpanded={isExpanded}
        selectedAll={selectedAll || false}
        isSelectedToDelete={isSelectedToDelete}
        candidateUI={candidateUI}
        index={index}
        addToDelete={addToDelete}
        removeToDelete={removeToDelete}
        setIsExpanded={setIsExpanded}
        getHighestEducation={getHighestEducation}
      />
      {isExpanded && (
        <CandidateContent
          candidateUI={candidateUI}
          onViewAllTechnologies={() => setIsVisibleAllTechnologies(true)}
          onViewBriefAnalysis={() => setIsVisibleBriefAnalysis(true)}
        />
      )}

      <BriefAnalysisModal
        info={candidateUI.scores}
        isOpen={isVisibleBriefAnalysis}
        onClose={() => setIsVisibleBriefAnalysis(false)}
      />

      <MoreTechnologiesModal
        isOpen={isVisibleAllTechnologies}
        onClose={() => setIsVisibleAllTechnologies(false)}
        technologies={candidateUI.technologies.all ?? []}
      />
    </div>
  );
};

export default CandidateCard;
