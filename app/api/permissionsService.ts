import apiClient from "./config/api-config.api";

const getAllPermissions = async () => {
  try {
    const permissionsResponse = await apiClient.get("/permissions/all", {
      withCredentials: true,
    });
    return permissionsResponse.data;
  } catch (error) {
    console.log(error);
  }
};

export const permissionsService = {
  getAllPermissions
};
