import Image from "next/image";
import { useRouter } from "next/navigation";
import { Project } from "@/app/types/project.types";

import folder_icon from "./../../../assets/folder.svg";

interface DrawerProjectItemProps {
  project: Project;
  onToggle: () => void;
}

const DrawerProjectItem = ({
  project,
  onToggle,
}: Readonly<DrawerProjectItemProps>) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${project.projectId}`);
    onToggle();
  };

  return (
    <div
      key={project.projectId}
      className="group flex w-full cursor-pointer items-center justify-start gap-2 rounded-md px-2 py-2 text-sm ring-[0.5px] ring-primaryBlue transition-colors hover:bg-purple hover:text-white hover:ring-purple"
      onClick={handleClick}
    >
      <Image
        src={folder_icon}
        alt="Folder Icon"
        className="size-6 p-1 text-primaryBlue group-hover:text-white"
      />
      <span className="line-clamp-1 text-drawerDarkPurple group-hover:text-white">
        {project.projectName}
      </span>
    </div>
  );
};

export default DrawerProjectItem;
