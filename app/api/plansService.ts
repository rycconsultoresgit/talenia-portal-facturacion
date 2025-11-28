import apiClient from "./config/api-config.api";

const getAllPlans = async () => {
  try {
    const users = await apiClient.get("/plans/all", {
      withCredentials: true,
    });
    return users.data;
  } catch (error) {
    console.log(error);
  }
};

export const plansService = {
  getAllPlans,
};
