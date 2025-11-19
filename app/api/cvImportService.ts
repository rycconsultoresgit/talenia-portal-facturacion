import { cvProcessClient } from "./config/cv-config.api";

const getFiltredCvs = async (
  projectId: string,
  query: string = "",
  filters: {
    projectId: string;
    query?: string[];
    educationLevels?: string[];
    minExperience?: number;
    maxAge?: number;
    minSalary?: number;
    maxSalary?: number;
    gender?: string[];
    career?: string[];
    languages?: Array<{ name: string; level: string }>;
  } = { projectId },
) => {
  try {
    const response = await cvProcessClient.post("/cv/search", filters);
    console.log(query);
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteCV = async (id: string) => {
  await cvProcessClient.delete(`/cv/${id}`);
};

const deleteAllCV = async (projectId: string) => {
  const response = await cvProcessClient.delete(`/cv/all/${projectId}`);
  return response.data;
};

const uploadMultipleCVs = async ({
  files,
  projectId,
  userId,
}: {
  files: File[];
  projectId: string;
  userId: number;
}) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // multiple "files" entries
    });
    formData.append("projectId", projectId);
    formData.append("userId", userId.toString());

    const response = await cvProcessClient.post<{
      success: boolean;
      message: string;
      batchId: string;
      filesCount: number;
      timestamp: string;
    }>("/cv-upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // Debe incluir el batchId para SSE
  } catch (error: unknown) {
    const axiosError = error as {
      message: string;
      code?: string;
      response?: {
        data?: unknown;
        status?: number;
      };
    };

    if (axiosError.code === "ECONNABORTED") {
      throw new Error(
        "El servicio de procesamiento de CV no responde. Verifique que esté ejecutándose en " +
          cvProcessClient.defaults.baseURL,
      );
    } else if (!axiosError.response) {
      throw new Error(
        "No se puede conectar al servicio de procesamiento de CV en " +
          cvProcessClient.defaults.baseURL,
      );
    } else {
      throw error;
    }
  }
};

const getLimitStatus = async (userId: number) => {
  try {
    const response = await cvProcessClient.get<{
      isDemo: boolean;
      processedCvs: number;
      maxCvs: number;
      remainingCvs: number;
      failedCvs?: number;
      isBlocked?: boolean;
    }>(`/cv-upload/limit-status?userId=${userId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cvImportService = {
  getFiltredCvs,
  deleteCV,
  deleteAllCV,
  uploadMultipleCVs,
  getLimitStatus,
};
