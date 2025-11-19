import Image from "next/image";

import { formatDate } from "@/app/utils/string.utils";
import { Project } from "@/app/types/project.types";

import process_in_progress_icon from "./../../assets/project_in_progress_icon.svg";
import process_complete_icon from "./../../assets/project_complete_icon.svg";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent, projectId: string) => void;
  isSelected?: boolean;
}

const ProjectCard = ({
  project,
  onClick,
  onContextMenu,
  isSelected,
}: ProjectCardProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu?.(e, project.projectId);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={onClick}
      className={`flex cursor-pointer flex-col rounded-md px-3 py-4 transition-all duration-300 ease-in-out hover:bg-white/20 ${
        isSelected ? "scale-95 ring-1 ring-purple/50" : ""
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="rounded-md bg-gradient-to-tr from-lightPurple via-[#EEE9FF] to-[#D9CEFF] p-2 shadow-sm ring-1 ring-white/50">
          <Image
            src={
              project.processComplete
                ? process_complete_icon
                : process_in_progress_icon
            }
            alt="Project status"
            className="size-8 p-1 text-primaryBlue"
          />
        </div>
        <p className="mt-3 line-clamp-1 text-center text-sm font-medium capitalize text-darkPurple">
          {project.projectName}
        </p>
        <p className="text-sm font-light text-lightGray">
          {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
