import { cvProcessClient } from "./config/cv-config.api";

const getLangs = async (projectId: string) => {
  const response = await cvProcessClient.get(`/cv/languages/${projectId}`);
  return response.data;
};

export const languageService = {
  getLangs,
};
