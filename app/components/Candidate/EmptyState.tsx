import { Spinner } from "@heroui/react";
import { HiOutlineUpload } from "react-icons/hi";
import Image from "next/image";
import { PrimaryButton } from "../Common/Buttons";
import attach_folder from "./../../assets/attach_folder.svg";
import { PiWarningOctagonLight } from "react-icons/pi";

interface EmptyStateProps {
  isUploading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onUpload: (files: File[]) => void;
  hasAnyCandidates?: boolean; // Para diferenciar entre búsqueda sin resultados vs listado vacío
}

import React, { useRef } from "react";

const EmptyState = ({
  isUploading,
  hasError,
  onRetry,
  onUpload,
  hasAnyCandidates = false,
}: EmptyStateProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset para permitir subir el mismo archivo varias veces
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-gradient-to-r from-[#E9E3FF]/15 via-[#EEE9FF]/20 to-[#D9CEFF]/30 p-4 text-center backdrop-blur-sm">
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
      {isUploading && !hasError ? (
        <Spinner
          size="lg"
          color="white"
          classNames={{
            circle2: "border-opacity-50 ",
            label: "text-sm text-drawerLightGray",
          }}
          label="Cargando contenido ..."
        />
      ) : hasError ? (
        <div className="text-center">
          <PiWarningOctagonLight className="mb-2 inline-block size-10 text-customPurple" />

          <p className="text-base font-medium text-drawerLightGray">
            Algo salió mal. Por favor, inténtalo de nuevo más tarde.
          </p>

          <PrimaryButton
            onClick={onRetry}
            className="mt-4"
            label="Reintentar"
          />
        </div>
      ) : hasAnyCandidates ? (
        // Búsqueda sin resultados (hay candidatos en el proyecto pero no coinciden con los filtros)
        <div className="flex flex-col items-center text-center">
          <PiWarningOctagonLight className="mb-2 inline-block size-10 text-customPurple" />
          <div className="mt-2 text-sm text-lightGray">
            No encontramos coincidencias con tu búsqueda.
          </div>
        </div>
      ) : (
        // Listado completamente vacío (no hay candidatos en el proyecto)
        <>
          <Image
            src={attach_folder}
            alt="Folder Icon"
            className="size-8 text-primaryBlue"
          />
          <div className="mt-2 text-sm text-lightGray">
            Arrastra tu archivo o súbelo para comenzar.
          </div>

          <PrimaryButton
            onClick={handleButtonClick}
            icon={HiOutlineUpload}
            className="mt-7"
            label="Importar Cv's"
          />
        </>
      )}
    </div>
  );
};

export default EmptyState;
