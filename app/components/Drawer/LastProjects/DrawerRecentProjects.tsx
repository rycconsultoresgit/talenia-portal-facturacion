import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Project } from "@/app/types/project.types";
import DrawerProjectItem from "./DrawerProjectItem";
import { DrawerEmptyContent } from "../DrawerEmptyContent";

interface DrawerRecentProjectsProps {
  isLoading: boolean;
  error: string | null;
  recentProjects: Project[];
  onToggle: () => void;
}

export const DrawerRecentProjects = ({
  isLoading,
  error,
  recentProjects,
  onToggle,
}: Readonly<DrawerRecentProjectsProps>) => {
  return (
    <div className="h-1/2">
      <div className="mb-2 text-base font-normal tracking-wide text-primaryBlue">
        Visitados recientes
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-2">
          <AiOutlineLoading3Quarters
            className="animate-spin text-purple"
            size={24}
          />
        </div>
      ) : error ? (
        <p className="px-2 text-sm text-red-400">{error}</p>
      ) : recentProjects.length > 0 ? (
        <div className="space-y-2 pt-3">
          {recentProjects.map((project: Project) => (
            <DrawerProjectItem
              key={project.projectId}
              project={project}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <DrawerEmptyContent message="Sin requerimientos disponibles actualmente." />
      )}
    </div>
  );
};
