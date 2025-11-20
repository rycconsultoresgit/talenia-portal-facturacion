import { CandidateUI } from "@/app/types/candidate.types";
import ProfessionalProfile from "./AccordeonDetails/ProfessionalProfileSection";
import EducationAndSkillsSection from "./AccordeonDetails/EducationAndSkillsSection";
import DetailedAnalysisSection from "./AccordeonDetails/DetailedAnalysisSection";
import { useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/Common/Buttons";
import { VscOpenPreview } from "react-icons/vsc";

interface CandidateContentProps {
  candidateUI: CandidateUI;
  onViewAllTechnologies: () => void;
  onViewBriefAnalysis: () => void;
}

export default function CandidateContent({
  candidateUI,
  onViewAllTechnologies,
  onViewBriefAnalysis,
}: Readonly<CandidateContentProps>) {
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [analisisExpanded, setAnalisisExpanded] = useState(false);
  const [formationExpanded, setFormationExpanded] = useState(false);

  return (
    <div
      className="mt-[14px] flex h-fit w-full cursor-default flex-col gap-4 px-4 py-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex w-full flex-col gap-2 rounded-lg text-purple">
        {/* Sección de análisis detallado */}
        <DetailedAnalysisSection
          industryScore={candidateUI.scores.industryScore.score}
          industryFit={candidateUI.industryFit}
          observations={candidateUI.observations}
          isExpanded={analisisExpanded}
          setIsExpanded={setAnalisisExpanded}
        />

        {/* Perfil profesional */}
        <ProfessionalProfile
          candidateUI={candidateUI}
          onViewAllTechnologies={onViewAllTechnologies}
          isExpanded={profileExpanded}
          setIsExpanded={setProfileExpanded}
        />
        {/* Sección de formación y habilidades */}
        <EducationAndSkillsSection
          education={candidateUI.education}
          certifications={candidateUI.certifications}
          languages={candidateUI.languages}
          softSkills={candidateUI.skills.soft}
          isExpanded={formationExpanded}
          setIsExpanded={setFormationExpanded}
        />

        <div className="flex flex-row gap-2 place-self-end">
          <SecondaryButton
            label={
              profileExpanded || analisisExpanded || formationExpanded
                ? "Cerrar todo"
                : "Abrir todo"
            }
            onClick={() => {
              const shouldExpand = !(
                profileExpanded ||
                analisisExpanded ||
                formationExpanded
              );
              setProfileExpanded(shouldExpand);
              setAnalisisExpanded(shouldExpand);
              setFormationExpanded(shouldExpand);
            }}
          />

          <PrimaryButton
            label="Análisis breve"
            className="w-fit px-4"
            onClick={() => onViewBriefAnalysis()}
            icon={VscOpenPreview}
          />
        </div>
      </div>
    </div>
  );
}
