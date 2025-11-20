import axios from "axios";
import { ApiFolder, Folder } from "../types/folder.types";
import apiClient from "./config/api-config.api";
import { ApiProject, Project } from "../types/project.types";

const createFolder = async (
  userId: number,
  folderName: string,
): Promise<Folder> => {
  try {
    const response = await apiClient.post<ApiFolder>("/folders", {
      user_id: userId,
      folder_name: folderName,
    });

    const folder: Folder = {
      folderId: response.data.folder_id,
      userId: response.data.user_id,
      folderName: response.data.folder_name,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      projects: response.data.projects || [],
    };

    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

const findFoldersByUser = async (
  userId: number,
  fromDate?: string,
  search?: string,
): Promise<Folder[]> => {
  try {
    const response = await apiClient.get<ApiFolder[]>(
      `/folders/user/${userId}`,
      {
        params: {
          ...(fromDate && { fromDate }),
          ...(search && search.trim() !== "" && { search: search.trim() }),
        },
      },
    );

    const folders: Folder[] = response.data.map((apiFolder) => ({
      folderId: apiFolder.folder_id,
      userId: apiFolder.user_id,
      folderName: apiFolder.folder_name,
      createdAt: apiFolder.created_at,
      updatedAt: apiFolder.updated_at,
      projects: apiFolder.projects,
    }));

    return folders;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to fetch folders";
      console.error("Error fetching folders:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error fetching folders:", error);
    throw new Error("Failed to fetch folders. Please try again later.");
  }
};

const findProjectsFolder = async (
  folderId: string,
  fromDate?: string,
  search?: string,
): Promise<Project[]> => {
  try {
    const response = await apiClient.get<ApiProject[]>(
      `/folders/${folderId}/projects`,
      {
        params: {
          ...(fromDate && { fromDate }),
          ...(search && search.trim() !== "" && { search: search.trim() }),
        },
      },
    );

    //convert api response to Project[]
    const projects: Project[] = response.data.map((apiProject) => ({
      projectId: apiProject.project_id,
      projectName: apiProject.project_name,
      projectDescription: apiProject.project_description,
      userId: apiProject.user_id,
      createdAt: apiProject.created_at,
      updatedAt: apiProject.updated_at,
      processComplete: apiProject.process_complete,
      folderId: apiProject.folder_id,
    }));

    return projects;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to fetch folder projects ";
      console.error("Error fetching folder projects:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error fetching folder projects:", error);
    throw new Error("Failed to fetch folder projects. Please try again later.");
  }
};

const findFolderById = async (folderId: string): Promise<Folder> => {
  try {
    const response = await apiClient.get<ApiFolder>(`/folders/${folderId}`);

    const folder: Folder = {
      folderId: response.data.folder_id,
      userId: response.data.user_id,
      folderName: response.data.folder_name,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      projects: response.data.projects || [],
    };

    return folder;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to fetch folder";
      console.error("Error fetching folder:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error fetching folder:", error);
    throw new Error("Failed to fetch folder. Please try again later.");
  }
};

const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    await apiClient.delete(`/folders/${folderId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to delete folder";
      console.error("Error deleting folder:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error deleting folder:", error);
    throw new Error("Failed to delete folder. Please try again later.");
  }
};

const updateFolder = async (
  folderId: string,
  folderName: string,
): Promise<void> => {
  try {
    await apiClient.patch(`/folders/${folderId}`, { folder_name: folderName });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to update folder";
      console.error("Error updating folder:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error updating folder:", error);
    throw new Error("Failed to update folder. Please try again later.");
  }
};

const moveProjectToFolder = async (
  projectId: string,
  folderId: string,
): Promise<void> => {
  try {
    await apiClient.post("/folders/move-project", {
      project_id: projectId,
      folder_id: folderId,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Failed to move project";
      console.error("Error moving project:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error moving project:", error);
    throw new Error("Failed to move project. Please try again later.");
  }
};

export const folderService = {
  createFolder,
  findFoldersByUser,
  findProjectsFolder,
  findFolderById,
  deleteFolder,
  updateFolder,
  moveProjectToFolder,
};
