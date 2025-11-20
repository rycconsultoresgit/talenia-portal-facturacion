// Tipos para CV Import - Respuesta del servicio

// Tipos para la API
export interface CvImportDto {
  cargo: string;
}

export interface UploadCVDto {
  file: File;
  cargo: string;
  projectId: string;
}
