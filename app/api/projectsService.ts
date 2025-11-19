import axios from "axios";
import apiClient from "./config/api-config.api";
import {
  ApiPinnedProject,
  ApiProject,
  PinnedProject,
  Project,
  UpdateProjectParams,
} from "../types/project.types";

const createProject = async (
  projectName: string,
  projectDescription: string,
  userId: number,
  folderId: string,
): Promise<Project> => {
  try {
    const response = await apiClient.post<ApiProject>("/projects", {
      project_name: projectName,
      project_description: projectDescription,
      user_id: userId,
      folder_id: folderId,
    });

    const project: Project = {
      projectId: response.data.project_id,
      projectName: response.data.project_name,
      projectDescription: response.data.project_description,
      userId: response.data.user_id,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      processComplete: response.data.process_complete,
      folderId: response.data.folder_id,
    };

    return project;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to create project",
      );
    }
    throw new Error("Failed to create project");
  }
};

const getProjects = async ({
  userId,
  fromDate,
  search,
}: {
  userId: number;
  fromDate?: string;
  search?: string;
}): Promise<Project[]> => {
  try {
    const response = await apiClient.get<ApiProject[]>("/projects", {
      params: {
        userId,
        ...(fromDate && { fromDate }),
        ...(search && search.trim() !== "" && { search: search.trim() }),
      },
    });

    //MAP
    const projects: Project[] = response.data.map((project) => ({
      projectId: project.project_id,
      projectName: project.project_name,
      projectDescription: project.project_description,
      userId: project.user_id,
      createdAt: project.created_at,
      processComplete: project.process_complete,
      updatedAt: project.updated_at,
      folderId: project.folder_id,
    }));

    return projects;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to fetch projects";
      console.error("Error fetching projects:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error fetching projects:", error);
    throw new Error("Failed to fetch projects. Please try again later.");
  }
};

const getProject = async (projectId: string): Promise<Project> => {
  try {
    const response = await apiClient.get<ApiProject>(`/projects/${projectId}`);

    const project: Project = {
      projectId: response.data.project_id,
      projectName: response.data.project_name,
      projectDescription: response.data.project_description,
      userId: response.data.user_id,
      createdAt: response.data.created_at,
      processComplete: response.data.process_complete,
      updatedAt: response.data.updated_at,
      folderId: response.data.folder_id,
    };

    return project;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch project",
      );
    }
    throw new Error("Failed to fetch project");
  }
};

export const updateProject = async (
  updateProject: UpdateProjectParams,
): Promise<Project> => {
  try {
    const response = await apiClient.patch<ApiProject>(
      `/projects/${updateProject.projectId}`,
      {
        project_name: updateProject.projectName,
        process_complete: updateProject.processComplete,
      },
    );

    const project: Project = {
      projectId: response.data.project_id,
      projectName: response.data.project_name,
      projectDescription: response.data.project_description,
      userId: response.data.user_id,
      createdAt: response.data.created_at,
      processComplete: response.data.process_complete,
      updatedAt: response.data.updated_at,
      folderId: response.data.folder_id,
    };

    return project;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to update project",
      );
    }
    throw new Error("Failed to update project");
  }
};

const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await apiClient.delete(`/projects/${projectId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to delete project",
      );
    }
    throw new Error("Failed to delete project");
  }
};

const markProjectAsComplete = async (projectId: string): Promise<Project> => {
  try {
    const response = await apiClient.patch<ApiProject>(
      `/projects/${projectId}/complete`,
      {},
    );

    const project: Project = {
      projectId: response.data.project_id,
      projectName: response.data.project_name,
      projectDescription: response.data.project_description,
      userId: response.data.user_id,
      createdAt: response.data.created_at,
      processComplete: response.data.process_complete,
      updatedAt: response.data.updated_at,
      folderId: response.data.folder_id,
    };

    return project;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to mark project as complete",
      );
    }
    throw new Error("Failed to mark project as complete");
  }
};

const addRecentProject = async ({
  userId,
  projectId,
}: {
  userId: number;
  projectId: string;
}): Promise<Project> => {
  try {
    const response = await apiClient.post<ApiProject>("/projects/recent", {
      user_id: userId,
      project_id: projectId,
    });

    const project: Project = {
      projectId: response.data.project_id,
      projectName: response.data.project_name,
      projectDescription: response.data.project_description,
      userId: response.data.user_id,
      createdAt: response.data.created_at,
      processComplete: response.data.process_complete,
      folderId: response.data.folder_id,
    };

    return project;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Si el proyecto ya está en recientes (409), no es realmente un error
      if (error.response.status === 409) {
        return error.response.data;
      }
      throw new Error(
        error.response.data?.message || "Failed to add project to recent",
      );
    }
    throw new Error("Failed to add project to recent");
  }
};

const getRecentProjects = async (userId: number): Promise<Project[]> => {
  try {
    const response = await apiClient.get<ApiProject[]>(
      `/projects/user/${userId}/recent`,
    );

    const projects: Project[] = response.data.map((project) => ({
      projectId: project.project_id,
      projectName: project.project_name,
      projectDescription: project.project_description,
      userId: project.user_id,
      createdAt: project.created_at,
      processComplete: project.process_complete,
      updatedAt: project.updated_at,
      folderId: project.folder_id,
    }));

    return projects;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch recent projects",
      );
    }
    throw new Error("Failed to fetch recent projects");
  }
};

export interface PinProjectParams {
  userId: number;
  projectId: string;
}

export interface PinProjectResponse {
  success: boolean;
  message?: string;
}

const pinProject = async ({
  userId,
  projectId,
}: PinProjectParams): Promise<PinProjectResponse> => {
  try {
    const response = await apiClient.post<PinProjectResponse>("/projects/pin", {
      user_id: userId,
      project_id: projectId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Failed to pin project");
    }
    throw new Error("Failed to pin project");
  }
};

const unpinProject = async (
  userId: number,
  projectId: string,
): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<{ success: boolean }>(
      `/projects/user/${userId}/pin/${projectId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to unpin project",
      );
    }
    throw new Error("Failed to unpin project");
  }
};

const getPinnedProjects = async (userId: number): Promise<PinnedProject[]> => {
  try {
    const response = await apiClient.get<ApiPinnedProject[]>(
      `/projects/user/${userId}/pinned`,
    );

    const projects: PinnedProject[] = response.data.map((project) => ({
      projectId: project.project_id,
      projectName: project.project_name,
      projectDescription: project.project_description,
      userId: project.user_id,
      createdAt: project.created_at,
      processComplete: project.process_complete,
      folder: {
        folderId: project.folder.folder_id,
        folderName: project.folder.folder_name,
      },
    }));

    return projects;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch pinned projects",
      );
    }
    throw new Error("Failed to fetch pinned projects");
  }
};

export const projectService = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  markProjectAsComplete,
  addRecentProject,
  getRecentProjects,
  pinProject,
  unpinProject,
  getPinnedProjects,
};
