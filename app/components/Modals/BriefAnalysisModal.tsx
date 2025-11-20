"use client";

import { Scores } from "@/app/types/candidate.types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "@heroui/react";
import { CloseModalButton, PrimaryButton } from "../Common/Buttons";
import { AiOutlineInfoCircle } from "react-icons/ai";
import {
  assignationColorToBar,
  assignationColorToBarTrack,
} from "@/app/utils/score.utils";

interface BriefAnalisysProps {
  isOpen: boolean;
  onClose: () => void;
  info: Scores | undefined;
}

interface ScoreSectionProps {
  title: string;
  score?: {
    score?: number;
    justification?: string;
  };
  ariaLabelPrefix: string;
}

const ScoreSection = ({ title, score, ariaLabelPrefix }: ScoreSectionProps) => (
  <div className="my-2 space-y-2">
    <label className="text-base font-medium">{title}</label>
    <Progress
      value={score?.score}
      size="md"
      classNames={{
        indicator: score?.score ? assignationColorToBar(score.score) : "",
        track: score.score ? assignationColorToBarTrack(score.score) : "",
      }}
      aria-label={`${ariaLabelPrefix}: ${score?.score || 0}%`}
    />
    {score?.justification && (
      <div className="flex items-center gap-3 rounded-lg bg-white/80 px-4 py-2">
        <AiOutlineInfoCircle className="flex-shrink-0 text-darkPurple" />
        <p className="font-light text-darkPurple">{score.justification}</p>
      </div>
    )}
  </div>
);

const BriefAnalysis = ({ isOpen, onClose, info }: BriefAnalisysProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="max-h-[579px] max-w-4xl rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-primaryBlue">
            Análisis breve
          </h3>

          <CloseModalButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="gt-scroll-white me-1 overflow-y-auto px-4 py-3 text-sm font-light text-black">
          <ScoreSection
            title="Experiencia relevante en el cargo"
            score={info?.experienceScore}
            ariaLabelPrefix="Puntaje de experiencia"
          />

          <ScoreSection
            title="Tecnologías, herramientas o procesos usados afines a este perfil"
            score={info?.technologiesScore}
            ariaLabelPrefix="Puntaje de tecnologías"
          />

          <ScoreSection
            title="Formación académica y cursos/certificaciones"
            score={info?.educationScore}
            ariaLabelPrefix="Puntaje de formación académica"
          />

          <ScoreSection
            title="Habilidades blandas y actitud profesional"
            score={info?.softSkillsScore}
            ariaLabelPrefix="Puntaje de habilidades blandas"
          />

          <ScoreSection
            title="Idiomas y adaptabilidad internacional"
            score={info?.languagesScore}
            ariaLabelPrefix="Habilidades en idiomas"
          />

          <ScoreSection
            title="Logros cuantificables o destacables"
            score={info?.achievementsScore}
            ariaLabelPrefix="Puntaje de logros"
          />
        </ModalBody>

        <ModalFooter>
          <PrimaryButton
            onClick={onClose}
            label="Cerrar"
            className="px-4 py-2"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BriefAnalysis;
