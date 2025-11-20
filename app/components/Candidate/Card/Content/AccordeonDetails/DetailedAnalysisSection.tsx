import { Progress } from "@heroui/react";
import { ExpandArrowIcon } from "../../ExpandIcons";
import { BiCommentError } from "react-icons/bi";
import {
  assignationColorToBar,
  assignationColorToBarTrack,
} from "@/app/utils/score.utils";

const DetailedAnalysisSection = ({
  industryScore,
  industryFit,
  observations,
  isExpanded,
  setIsExpanded,
}: {
  industryScore: number;
  industryFit: {
    level: string;
    justification: string;
  };
  observations: string;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}) => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-between gap-4 border-t-1 border-divider/30 p-2">
      <div
        className="flex w-full cursor-pointer items-center justify-between"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="ml-5 flex items-center gap-3">
          <BiCommentError className="size-4 flex-shrink-0 text-purple" />
          <h3 className="cursor-pointer select-none text-base font-semibold">
            Detalles de análisis
          </h3>
        </div>
        <ExpandArrowIcon isExpanded={isExpanded} />
      </div>
      <div
        className={`w-full select-text items-center justify-center rounded-lg ${
          isExpanded ? "flex h-fit" : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-1 flex-row gap-2">
          <div className="flex flex-1 flex-col space-y-2 rounded-lg border bg-white/50 p-4 text-start font-light">
            <h3 className="w-full text-start text-base font-normal text-primaryBlue">
              Ajuste a la industria
            </h3>
            <div className="flex items-center justify-between gap-4 font-light">
              <div className="flex-1">
                <Progress
                  value={industryScore}
                  aria-label={`Ajuste a la industria: ${industryScore}%`}
                  classNames={{
                    indicator: industryScore
                      ? assignationColorToBar(industryScore)
                      : "",
                    track: industryScore
                      ? assignationColorToBarTrack(industryScore)
                      : "",
                  }}
                />
              </div>
              <p className="whitespace-nowrap text-sm font-light text-darkPurple">
                {industryFit.level}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto text-sm font-light text-darkPurple">
              {industryFit.justification}
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-lg border bg-white/50 p-4 text-start font-light">
            <h3 className="w-full text-start font-normal text-primaryBlue">
              Observaciones y recomendaciones
            </h3>
            <div className="flex-1 overflow-y-auto text-sm font-light text-darkPurple">
              <p className="mt-3 text-start">{observations}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysisSection;
