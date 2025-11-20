import { Folder } from "@/app/types/folder.types";
import Image from "next/image";

import folder_icon from "./../../assets/folder.svg";
import { formatDate } from "@/app/utils/string.utils";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent, folderId: string) => void;
  isSelected?: boolean;
}

const FolderCard = ({
  folder,
  onClick,
  onContextMenu,
  isSelected,
}: FolderCardProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu?.(e, folder.folderId);
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={handleContextMenu}
      className={`flex cursor-pointer flex-col rounded-md px-3 py-4 transition-all duration-300 ease-in-out hover:bg-white/20 ${
        isSelected ? "scale-95 ring-1 ring-purple/50" : ""
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="rounded-md bg-gradient-to-tr from-lightPurple via-[#EEE9FF] to-[#D9CEFF] p-2 shadow-sm ring-1 ring-white/50">
          <Image
            src={folder_icon}
            alt="Folder Icon"
            className="size-8 p-1 text-primaryBlue"
          />
        </div>
        <p className="mt-3 line-clamp-1 text-center text-sm font-medium capitalize text-darkPurple">
          {folder.folderName}
        </p>
        <p className="text-sm font-light text-lightGray">
          {formatDate(folder.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default FolderCard;
