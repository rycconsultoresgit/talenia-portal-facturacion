import React from "react";
import {
  getRecommendationStyles,
  RecommendationType,
} from "@/app/utils/recommendationStyles.utils";
import { ExpandArrowIconHeader } from "../ExpandIcons";
import { capitalize } from "@/app/utils/string.utils";

const CandidateRecommendation = ({
  recommendation,
  isExpanded,
}: {
  recommendation: RecommendationType;
  isExpanded: boolean;
}) => {
  const { bgColor, textColor } = getRecommendationStyles(recommendation);

  return (
    <div className="flex w-1/12 flex-row justify-between gap-1 px-2 py-3">
      <div className="flex h-full w-9/12 flex-col items-start justify-start px-1">
        <div
          className={`mt-1 flex items-center justify-center rounded-2xl ${bgColor} px-2 py-1`}
        >
          <span className={`text-xs font-medium ${textColor}`}>
            {capitalize(recommendation)}
          </span>
        </div>
      </div>

      <div className="flex h-full w-3/12 items-start justify-center">
        <ExpandArrowIconHeader isExpanded={isExpanded} />
      </div>
    </div>
  );
};

export default CandidateRecommendation;
