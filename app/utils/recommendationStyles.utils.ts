export type RecommendationType = "Apto" | "No apto" | "Observado";

export const getRecommendationStyles = (
  recommendation: RecommendationType,
): { bgColor: string; textColor: string } => {
  const styles: Record<string, { bgColor: string; textColor: string }> = {
    Apto: {
      bgColor: "bg-[#E6FFE3]",
      textColor: "text-[#38BD57]",
    },
    "No apto": {
      bgColor: "bg-[#FFE6E6]",
      textColor: "text-[#E74C3C]",
    },
    Observado: {
      bgColor: "bg-[#FFF3E0]",
      textColor: "text-[#F39C12]",
    },
  };

  return styles[recommendation];
};

export const RECOMMENDATION_TYPES = ["Apto", "No apto", "Observado"] as const;
