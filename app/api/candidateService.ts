import { cvProcessClient } from "./config/cv-config.api";

const updateCandidate = async (
  candidateId: string,
  data: {
    candidate: {
      selected?: boolean;
      salaryExpectation?: number;
      address?: string;
      technologies?: {
        all: string[];
      };
      recommendation?: "Apto" | "Observado" | "No apto";
    };
  },
) => {
  const response = await cvProcessClient.patch(`/cv/${candidateId}`, data);

  return response.data;
};

export const candidateService = {
  updateCandidate,
};
