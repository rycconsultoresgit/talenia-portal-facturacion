import { useState, useEffect, useCallback } from "react";
import { projectService } from "@/app/api/projectsService";
import { toast } from "sonner";
import { Project } from "../types/project.types";

/**
 * Hook para manejar el nombre de un proyecto y su actualización
 * @param projectId Id del proyecto
 * @returns Objeto con las propiedades project, projectName, newName, isEditing, loading, setNewName, setIsEditing, saveName
 */
const useProjectName = (projectId?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState("");
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Cargar proyecto y nombre inicial
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        setError(false);
        const projectData = await projectService.getProject(projectId);
        setProject(projectData);
        setProjectName(projectData.projectName);
        setNewName(projectData.projectName);
      } catch {
        setError(true);
        toast.error("Error al cargar el requerimiento", {
          description: "No se pudo obtener la información",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Guardar nuevo nombre
  const saveName = useCallback(async () => {
    if (!project || !newName.trim()) return;

    try {
      if (projectName !== newName) {
        await projectService.updateProject({
          projectId: project.projectId,
          projectName: newName,
        });
        setProjectName(newName);
        toast.success("Requerimiento actualizado correctamente");
      }
    } catch {
      toast.error("Error al actualizar el nombre del requerimiento");
    } finally {
      setIsEditing(false);
    }
  }, [project, newName, projectName]);

  return {
    project,
    projectName,
    newName,
    isEditing,
    loading,
    error,
    setNewName,
    setIsEditing,
    saveName,
  };
};

export default useProjectName;
