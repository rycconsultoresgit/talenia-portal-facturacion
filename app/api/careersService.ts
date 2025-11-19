import { cvProcessClient } from "./config/cv-config.api";

const getCareers = async (projectId: string) => {
  const response = await cvProcessClient.get(`/cv/careers/${projectId}`);
  return response.data;
};

export const careersService = {
  getCareers,
};
