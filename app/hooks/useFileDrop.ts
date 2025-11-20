import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";

interface UseFileDropProps {
  onFilesDropped: (files: File[]) => void;
  validFileTypes?: string[];
  validExtensions?: string[];
  disabled?: boolean;
  blockedMessage?: string;
  onBlockedDrop?: () => void;
}

// Función de utilidad para validar archivos
const validateFiles = (
  files: File[],
  validFileTypes: string[],
  validExtensions: string[],
) => {
  return files.filter((file) => {
    const extension = file.name.slice(
      ((file.name.lastIndexOf(".") - 1) >>> 0) + 2,
    );
    return (
      validFileTypes.includes(file.type) ||
      validExtensions.includes("." + extension.toLowerCase())
    );
  });
};

// Tipos de archivo por defecto
const DEFAULT_VALID_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const DEFAULT_VALID_EXTENSIONS = [".pdf", ".doc", ".docx"];

/**
 * Hook para manejar el arrastre y soltar archivos
 * @param onFilesDropped Callback que se ejecuta cuando se soltar archivos validos
 * @param validFileTypes Tipos de archivos validos (opcional)
 * @param validExtensions Extensiones de archivos validas (opcional)
 * @param disabled Si está deshabilitado el drop zone
 * @param blockedMessage Mensaje a mostrar cuando está bloqueado
 * @param onBlockedDrop Callback cuando se intenta soltar en modo bloqueado
 * @returns Objeto con las propiedades isDragging, dropZoneRef, handleDragOver, handleDragEnter, handleDragLeave, handleDrop
 */
export const useFileDrop = ({
  onFilesDropped,
  validFileTypes = DEFAULT_VALID_FILE_TYPES,
  validExtensions = DEFAULT_VALID_EXTENSIONS,
  disabled = false,
  blockedMessage = "Espera a que termine el lote actual antes de subir más archivos.",
  onBlockedDrop,
}: UseFileDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const overRafRef = useRef<number | null>(null);

  // Memoizar los tipos y extensiones para evitar recrear los arrays
  const memoizedValidFileTypes = useMemo(
    () => validFileTypes,
    [validFileTypes],
  );
  const memoizedValidExtensions = useMemo(
    () => validExtensions,
    [validExtensions],
  );

  // Helper para verificar si el arrastre contiene archivos
  const isFilesDrag = useCallback((dt?: DataTransfer | null) => {
    if (!dt) return false;
    try {
      const types = dt.types ? Array.from(dt.types) : [];
      return types.includes("Files");
    } catch {
      return false;
    }
  }, []);

  // Función segura para actualizar el estado de bloqueo
  const setBlockedSafe = useCallback((next: boolean) => {
    setIsBlocked((prev) => (prev === next ? prev : next));
  }, []);

  // Manejadores de eventos de arrastre optimizados
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = disabled ? "none" : "copy";
    },
    [disabled],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && isFilesDrag(e.dataTransfer)) {
        setIsDragging(true);
      }
    },
    [disabled, isFilesDrag],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const relatedTarget = e.relatedTarget as Node;
    if (
      !dropZoneRef.current?.contains(relatedTarget) &&
      relatedTarget !== document.documentElement
    ) {
      setIsDragging(false);
    }
  }, []);

  // Manejador de drop optimizado
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) {
        // Bloqueado: evitar carga y notificar
        onBlockedDrop?.();
        toast.warning("Procesamiento en curso", {
          description: blockedMessage,
          position: "bottom-right",
          duration: 2500,
        });
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const validFiles = validateFiles(
        files,
        memoizedValidFileTypes,
        memoizedValidExtensions,
      );

      if (validFiles.length > 0) {
        onFilesDropped(validFiles);
      } else {
        toast.error("Tipo de archivo no soportado", {
          description: `Por favor, sube archivos con las siguientes extensiones: ${memoizedValidExtensions.join(", ")}`,
          position: "bottom-right",
          duration: 3000,
        });
      }
    },
    [
      disabled,
      onBlockedDrop,
      blockedMessage,
      onFilesDropped,
      memoizedValidFileTypes,
      memoizedValidExtensions,
    ],
  );

  // Listeners globales para mostrar overlay cuando está bloqueado
  useEffect(() => {
    setBlockedSafe(false);
    dragCounterRef.current = 0;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (overRafRef.current) {
      cancelAnimationFrame(overRafRef.current);
      overRafRef.current = null;
    }
    if (!disabled) return;

    const onEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isFilesDrag(e.dataTransfer)) return;
      dragCounterRef.current += 1;
      // Mostrar overlay cuando pasamos de 0 -> 1
      if (dragCounterRef.current === 1) setBlockedSafe(true);
      if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
      // Cancel any scheduled hide while we keep dragging
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const onOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isFilesDrag(e.dataTransfer)) return;
      // Mantener overlay visible durante el over y cancelar ocultado pendiente
      if (overRafRef.current) cancelAnimationFrame(overRafRef.current);
      overRafRef.current = requestAnimationFrame(() => {
        setBlockedSafe(true);
      });
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
    };

    const onLeave = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      // dragleave puede dispararse múltiples veces por elementos hijos
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) {
        // Debounce para evitar parpadeo entre elementos vecinos
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => {
          setBlockedSafe(false);
          hideTimerRef.current = null;
        }, 150);
      }
    };

    const onDropGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setBlockedSafe(false);
      if (onBlockedDrop) onBlockedDrop();
      toast.warning("Procesamiento en curso", {
        description:
          blockedMessage ||
          "Espera a que termine el lote actual antes de subir más archivos.",
        position: "bottom-right",
        duration: 2500,
      });
    };

    const onDragEndGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setBlockedSafe(false);
    };

    // Usar solo 'document' para reducir eventos duplicados entre window/html/body
    const targets: Document[] = [document];

    const opts = { capture: true } as AddEventListenerOptions;
    targets.forEach((t) => {
      t.addEventListener("dragenter", onEnter as EventListener, opts);
      t.addEventListener("dragover", onOver as EventListener, opts);
      t.addEventListener("dragleave", onLeave as EventListener, opts);
      t.addEventListener("dragend", onDragEndGlobal as EventListener, opts);
      t.addEventListener("drop", onDropGlobal as EventListener, opts);
    });

    return () => {
      targets.forEach((t) => {
        t.removeEventListener("dragenter", onEnter as EventListener, true);
        t.removeEventListener("dragover", onOver as EventListener, true);
        t.removeEventListener("dragleave", onLeave as EventListener, true);
        t.removeEventListener(
          "dragend",
          onDragEndGlobal as EventListener,
          true,
        );
        t.removeEventListener("drop", onDropGlobal as EventListener, true);
      });
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (overRafRef.current) {
        cancelAnimationFrame(overRafRef.current);
        overRafRef.current = null;
      }
    };
  }, [disabled, blockedMessage, onBlockedDrop, isFilesDrag, setBlockedSafe]);

  return {
    isDragging,
    isBlocked,
    dropZoneRef,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
};
