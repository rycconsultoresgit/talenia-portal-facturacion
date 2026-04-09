import apiClient from "./config/api-config.api";
import { Plan } from "../types/plan.types";

type PlanPayload = {
  name?: string;
  price?: string | number;
  cvs?: string | number;
  evaluations?: string | number;
  description?: string;
};

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

const getPlanById = async (id: number): Promise<Plan> => {
  const response = await apiClient.get(`/plans/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const createNewPlan = async (data: PlanPayload) => {
  try {
    const res = await apiClient.post("/plans", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const updatePlan = async (id: number, data: PlanPayload) => {
  try {
    const res = await apiClient.patch(`/plans/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const deletePlan = async (id: number) => {
  try {
    const res = await apiClient.delete(`/plans/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const assignPermissionsToPlan = async (
  planId: number,
  permissionIds: number[],
) => {
  try {
    const res = await apiClient.post(`/plans/${planId}/permissions/assign`, {
      permissionIds,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const plansService = {
  getAllPlans,
  getPlanById,
  createNewPlan,
  deletePlan,
  updatePlan,
  assignPermissionsToPlan,
};
