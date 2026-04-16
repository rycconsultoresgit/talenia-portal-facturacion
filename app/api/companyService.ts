import apiClient from "./config/api-config.api";

const createCompany = async (body: Record<string, unknown>) => {
  try {
    const company = await apiClient.post("/companies",body);
    return company.data;
  } catch (error) {
    console.log(error);
  }
};

export const companyService = {
  createCompany,
};
