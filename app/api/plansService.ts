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

const createNewPlan = async (data:any) =>{
  try {
    const res = await apiClient.post('/plans',data)
    return res.data
  } catch (error) {
    console.log(error);
  }
}

const updatePlan = async (id:number,data:any) => {
  try {
    const res = await apiClient.patch(`/plans/${id}`,data)
    return res.data
  } catch (error) {
    console.log(error);
  }
}

const deletePlan = async (id:number) => {
  try {
    const res = await apiClient.delete(`/plans/${id}`)
    return res.data
  } catch (error) {
    console.log(error);
  }
}

const assignPermissionsToPlan = async (planId: number, permissionIds: number[]) => {
  try {
    const res = await apiClient.post(`/plans/${planId}/permissions/assign`, { permissionIds });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const plansService = {
  getAllPlans,createNewPlan,deletePlan,updatePlan, assignPermissionsToPlan
};
