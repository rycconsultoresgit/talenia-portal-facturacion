"use client";

import { useEffect, useState } from "react";
import { PinnedProject, Project } from "@/app/types/project.types";
import { projectService } from "@/app/api/projectsService";
import { useAuth } from "@/app/context/AuthContext";
import { DrawerRecentProjects } from "./LastProjects/DrawerRecentProjects";
import { DrawerPinnedProjects } from "./PinnedProjects/DrawerPinnedProjects";

interface DrawerContentProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DrawerContent({
  isOpen,
  onToggle,
}: Readonly<DrawerContentProps>) {
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  const [pinnedProjects, setPinnedProjects] = useState<PinnedProject[]>([]);

  const [isPinnedLoading, setIsPinnedLoading] = useState(false);
  const [pinnedError, setPinnedError] = useState<string | null>(null);

  // Fetch recent and pinned projects whenever the drawer opens, but not when on a specific project route
  useEffect(() => {
    const fetchProjects = async () => {
      // Skip fetching if we're on a specific project route
      if (!userId || !isOpen) return;

      // Fetch recent projects
      setIsLoading(true);
      setError(null);
      try {
        const projects = await projectService.getRecentProjects(userId);
        setRecentProjects(Array.isArray(projects) ? projects : []);
      } catch (err) {
        console.error("Error fetching recent projects:", err);
        setError("Error al cargar requerimientos recientes");
        setRecentProjects([]);
      } finally {
        setIsLoading(false);
      }

      // Fetch pinned projects
      setIsPinnedLoading(true);
      setPinnedError(null);
      try {
        const pinned = await projectService.getPinnedProjects(userId);
        setPinnedProjects(Array.isArray(pinned) ? pinned : []);
      } catch (err) {
        console.error("Error fetching pinned projects:", err);
        setPinnedError("Error al cargar requerimientos fijados");
        setPinnedProjects([]);
      } finally {
        setIsPinnedLoading(false);
      }
    };

    // Only fetch if the drawer is open
    if (isOpen) {
      fetchProjects();
    }
  }, [userId, isOpen]);

  return (
    <div className="h-full px-4">
      <div className="flex h-full w-full flex-col">
        {/* Sección de Últimos Proyectos */}
        <DrawerRecentProjects
          isLoading={isLoading}
          error={error}
          recentProjects={recentProjects}
          onToggle={onToggle}
        />

        <div className="mb-3 h-[2px] w-full rounded-2xl bg-divider/10" />

        {/* Sección de Proyectos Fijados */}
        <DrawerPinnedProjects
          isPinnedLoading={isPinnedLoading}
          pinnedError={pinnedError}
          pinnedProjects={pinnedProjects}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}
