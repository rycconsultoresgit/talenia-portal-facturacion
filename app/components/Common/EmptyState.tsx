import Image, { StaticImageData } from "next/image";

interface EmptyStateProps {
  icon: StaticImageData;
  message: string;
  isError?: boolean;
}

/**
 * Componente de estado vacío para listados de carpetas y proyectos.
 */
const EmptyState = ({ icon, message, isError = false }: EmptyStateProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <Image src={icon} alt="Empty state" className="size-8" quality={100} />
      <p
        className={`text-sm font-medium ${isError ? "text-red-400" : "text-drawerLightGray"}`}
      >
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
