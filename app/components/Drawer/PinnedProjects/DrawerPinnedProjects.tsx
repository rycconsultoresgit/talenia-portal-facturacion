import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PinnedProject } from "@/app/types/project.types";
import { DrawerEmptyContent } from "../DrawerEmptyContent";
import { DrawerPinnedProjectItem } from "./DrawerPinnedProjectItem";

interface DrawerPinnedProjectsProps {
  isPinnedLoading: boolean;
  pinnedError: string | null;
  pinnedProjects: PinnedProject[];
  onToggle: () => void;
}

export const DrawerPinnedProjects = ({
  isPinnedLoading,
  pinnedError,
  pinnedProjects,
  onToggle,
}: Readonly<DrawerPinnedProjectsProps>) => {
  return (
    <div className="h-1/2">
      <div className="mb-2 text-base font-normal tracking-wide text-primaryBlue">
        Marcadores
      </div>
      {isPinnedLoading ? (
        <div className="flex items-center justify-center py-2">
          <AiOutlineLoading3Quarters
            className="animate-spin text-purple"
            size={24}
          />
        </div>
      ) : pinnedError ? (
        <p className="px-2 text-sm text-red-400">{pinnedError}</p>
      ) : pinnedProjects.length > 0 ? (
        <div className="space-y-2">
          {pinnedProjects.map((project: PinnedProject) => (
            <DrawerPinnedProjectItem
              key={project.projectId}
              project={project}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <DrawerEmptyContent message="Agrega un requerimiento a la barra lateral para verlo aquí." />
      )}
    </div>
  );
};
