import { toast } from "sonner";

export const isValidFileType = (file: File): boolean => {
  const validFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validExtensions = [".pdf", ".doc", ".docx"];
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

  return (
    validFileTypes.includes(file.type) || validExtensions.includes(extension)
  );
};

export const validateFiles = (files: File[]): File[] => {
  return files.filter((file) => {
    const isValid = isValidFileType(file);
    if (!isValid) {
      toast.error(`Archivo no soportado: ${file.name}`, {
        description: "Solo se permiten archivos PDF, DOC o DOCX",
        position: "bottom-right",
        duration: 3000,
      });
    }
    return isValid;
  });
};

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string | string[];
      statusCode?: number;
    };
    status?: number;
  };
}

export const showFileError = (error: unknown) => {
  console.error("Error al procesar archivo:", error);

  let errorTitle = "Error al procesar archivo";
  let errorMessage = "Ocurrió un error al procesar el archivo";
  let duration = 4000;

  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    const responseData = apiError.response?.data;
    const statusCode = responseData?.statusCode || apiError.response?.status;

    // Extraer el mensaje del error
    if (responseData?.message) {
      if (Array.isArray(responseData.message)) {
        errorMessage = responseData.message[0];
      } else {
        errorMessage = responseData.message;
      }
    }

    // Manejar casos específicos
    if (statusCode === 400) {
      // Error de límite de cuenta demo
      if (errorMessage.includes("límite") || errorMessage.includes("demo")) {
        errorTitle = "Límite de cuenta demo alcanzado";
        duration = 8000; // Mostrar más tiempo
      } else if (errorMessage.includes("Block Account")) {
        errorTitle =
          "Tu cuenta ha sido bloqueada por múltiples fallos. Contacta a soporte.";
        duration = 10000;
      }
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast.error(errorTitle, {
    position: "bottom-right",
    duration: duration,
  });
};
