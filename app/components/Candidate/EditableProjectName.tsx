"use client";

import { FiEdit3 } from "react-icons/fi";
import { AiOutlineSave } from "react-icons/ai";
import useProjectName from "@/app/hooks/useProjectName";
import { Button, Input } from "@heroui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface EditableProjectNameProps {
  projectId: string;
  userId: number;
  setIsInfoModalOpen: (value: boolean) => void;
}

const EditableProjectName = ({
  projectId,
  setIsInfoModalOpen,
}: EditableProjectNameProps) => {
  const {
    projectName,
    newName,
    isEditing,
    loading,
    error,
    setNewName,
    setIsEditing,
    saveName,
  } = useProjectName(projectId);

  // Si hay error, no mostrar el componente
  if (error) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-10 w-[427px] animate-pulse items-center rounded-md bg-white/50 px-2"></div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        variant="bordered"
        value={isEditing ? newName : projectName}
        onChange={(e) => setNewName(e.target.value)}
        className="w-[400px]"
        disabled={!isEditing}
        classNames={{
          input: `font-medium text-lg text-lightGray ${isEditing ? "" : "cursor-default"}`,
          inputWrapper:
            "bg-white/30 w-full h-8 rounded-md flex flex-row items-center justify-center shadow-none border-0",
        }}
      />

      <div className="flex items-center justify-center gap-1">
        <Button
          variant="light"
          isIconOnly
          radius="full"
          size="md"
          className="group size-8 min-w-0 data-[hover]:bg-purple"
          onPress={() => {
            if (isEditing) {
              saveName();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? (
            <AiOutlineSave className="size-5 cursor-pointer text-customPurple transition-colors group-hover:text-white" />
          ) : (
            <FiEdit3 className="size-5 cursor-pointer text-customPurple transition-colors group-hover:text-white" />
          )}
        </Button>

        <Button
          variant="light"
          isIconOnly
          radius="full"
          size="md"
          className="group size-8 min-w-0 data-[hover]:bg-purple"
          onPress={() => setIsInfoModalOpen(true)}
        >
          <IoMdInformationCircleOutline className="size-5 cursor-pointer text-customPurple transition-colors group-hover:text-white" />
        </Button>
      </div>
    </div>
  );
};

export default EditableProjectName;
