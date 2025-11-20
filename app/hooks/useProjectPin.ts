import { useCallback, useEffect, useState } from "react";
import { projectService } from "../api/projectsService";
import { toast } from "sonner";

/**
 * Hook para manejar el estado de fijado de un proyecto
 * @param userId Id del usuario
 * @param projectId Id del proyecto
 * @returns Objeto con las propiedades isPinned, togglePin
 */
const useProjectPin = (userId?: number, projectId?: string) => {
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const fetchPinner = async () => {
      if (!userId || !projectId) return;

      try {
        const pinned = await projectService.getPinnedProjects(userId);
        setIsPinned(pinned.some((p) => p.projectId === projectId));
      } catch (err) {
        console.error("Error checking pinned projects:", err);
      }
    };

    fetchPinner();
  }, [userId, projectId]);

  const togglePin = useCallback(async () => {
    if (!userId || !projectId) return;
    try {
      if (isPinned) {
        await projectService.unpinProject(userId, projectId);
        toast.success("Requerimiento desfijado correctamente");
        setIsPinned(false);
      } else {
        await projectService.pinProject({ userId, projectId });
        toast.success("Requerimiento fijado correctamente");
        setIsPinned(true);
      }
    } catch (err) {
      const error = err as Error;
      if (error.message?.includes("Maximum of 5 pinned projects")) {
        toast.error("Límite alcanzado", {
          description:
            "Solo puedes tener 5 requerimientos fijados. Por favor, desfija uno primero.",
        });
      } else {
        console.error("Error updating pin status:", error);
        toast.error("Error al actualizar el estado de fijado");
      }
    }
  }, [isPinned, userId, projectId]);

  return { isPinned, togglePin };
};

export default useProjectPin;
