import { VscPinnedDirty } from "react-icons/vsc";
import useProjectPin from "@/app/hooks/useProjectPin";

interface PinProjectButtonProps {
  userId: number;
  projectId: string;
  className?: string;
}

const PinProjectButton = ({
  userId,
  projectId,
  className = "",
}: PinProjectButtonProps) => {
  const { isPinned, togglePin } = useProjectPin(userId, projectId);

  return (
    <button
      type="button"
      className={`flex h-8 w-9 cursor-pointer items-center justify-center rounded-md transition-colors ${
        isPinned ? "bg-[#A3FFB8]" : "bg-customPurple hover:bg-opacity-80"
      } ${className}`}
      onClick={togglePin}
      aria-label={isPinned ? "Desfijar requerimiento" : "Fijar requerimiento"}
    >
      <VscPinnedDirty
        className={`h-[18px] w-[19px] cursor-pointer ${
          isPinned ? "text-gray-800" : "text-[#A3FFB8]"
        }`}
      />
    </button>
  );
};

export default PinProjectButton;
