import React from "react";
import { useRouter } from "next/navigation";
import { VscPinnedDirty } from "react-icons/vsc";
import { PinnedProject } from "@/app/types/project.types";
import { RxCornerBottomLeft } from "react-icons/rx";
import Marquee from "react-fast-marquee";

interface DrawerPinnedProjectItemProps {
  project: PinnedProject;
  onToggle: () => void;
}

export const DrawerPinnedProjectItem = ({
  project,
  onToggle,
}: Readonly<DrawerPinnedProjectItemProps>) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    router.push(`/projects/${project.projectId}`);
    onToggle();
  };

  return (
    <div
      className="group flex w-full cursor-pointer items-center justify-start gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-purple hover:text-white hover:ring-purple"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VscPinnedDirty className="h-5 w-5 flex-shrink-0 text-taleniaBlue group-hover:text-white" />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-1 text-drawerDarkPurple group-hover:text-white">
          {project.projectName}
        </span>

        <div className="flex min-w-0 gap-1 text-lightGray group-hover:text-white">
          <RxCornerBottomLeft className="flex-shrink-0" />

          {isHovered ? (
            <Marquee play={true} speed={20} className="text-xs">
              {project.folder?.folderName} / {project.projectName}
              &nbsp;•&nbsp;
            </Marquee>
          ) : (
            <span className="truncate text-xs">
              {project.folder?.folderName} / {project.projectName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
