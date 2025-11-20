export interface ApiProject {
  project_id: string;
  project_name: string;
  project_description: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  process_complete: boolean;
  folder_id: string;
}

export interface ApiPinnedProject {
  project_id: string;
  project_name: string;
  project_description: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  process_complete: boolean;
  folder: {
    folder_id: string;
    folder_name: string;
  };
}

export interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string | null;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  processComplete: boolean;
  folderId: string;
}

export interface PinnedProject {
  projectId: string;
  projectName: string;
  projectDescription: string | null;
  userId: number;
  createdAt: string;
  updatedAt?: string;
  processComplete: boolean;
  folder: {
    folderId: string;
    folderName: string;
  };
}

export interface UpdateProjectParams extends Partial<Project> {
  processComplete?: boolean;
}
