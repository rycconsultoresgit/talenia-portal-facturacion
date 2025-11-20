import { Project } from "./project.types";

export interface ApiFolder {
  folder_id: string;
  folder_name: string;
  user_id: number;
  created_at: string;
  updated_at: string | null;
  projects: Project[];
}

export interface Folder {
  folderId: string;
  folderName: string;
  userId: number;
  createdAt: string;
  updatedAt: string | null;
  projects: Project[];
}
