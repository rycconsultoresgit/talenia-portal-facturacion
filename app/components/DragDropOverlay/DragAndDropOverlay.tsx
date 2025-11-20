import { GrDocumentText } from "react-icons/gr";
import Image from "next/image";
import attach_folder from "./../../assets/attach_folder.svg";

interface DragDropOverlayProps {
  isDragging: boolean;
  message?: string;
}

const DragDropOverlay = ({ isDragging, message }: DragDropOverlayProps) => {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 ${
        isDragging ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="flex h-64 w-[458px] max-w-[458px] flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#ECF4FF] via-white to-[#EAE4FF] p-3">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-1 border-dashed border-customPurple">
            <Image
              src={attach_folder}
              alt="Folder Icon"
              className="size-8 text-primaryBlue"
            />
            <div className="mt-[10px] flex h-[64px] w-[378px] flex-col items-center justify-center text-center">
              {message ? (
                <>
                  <p className="text-lg font-[700] text-purple">
                    Acción no disponible
                  </p>
                  <p className="text-base font-medium text-[#251D3F]">
                    {message}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-purple">
                    Suelta los archivos aquí
                  </p>
                  <p className="text-pretty text-base font-normal text-darkPurple">
                    Arrastra y suelta los archivos para agregarlos al proyecto
                  </p>
                </>
              )}
            </div>
            <div className="mt-3 flex h-8 flex-row items-center justify-center rounded-md bg-lightPurple px-3 py-1 text-sm font-normal text-darkPurple">
              <GrDocumentText className="h-4 w-4 text-darkPurple" />
              <h4 className="ml-2">
                Formatos soportados:{" "}
                <span className="ml-1 text-sm font-normal">PDF, DOC, DOCX</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropOverlay;
