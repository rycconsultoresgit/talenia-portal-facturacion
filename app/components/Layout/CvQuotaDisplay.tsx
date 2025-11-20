"use client";

import { useEffect, useState, useCallback } from "react";
import { cvImportService } from "@/app/api/cvImportService";
import { AiOutlineFileText } from "react-icons/ai";
import { MdBlock } from "react-icons/md";
import { Tooltip } from "@heroui/react";

interface CvQuotaDisplayProps {
  userId: number;
  refreshTrigger?: number; // Prop para forzar actualización externa
}

interface QuotaStatus {
  isDemo: boolean;
  processedCvs: number;
  maxCvs: number;
  remainingCvs: number;
  failedCvs?: number;
  isBlocked?: boolean;
}

export default function CvQuotaDisplay({
  userId,
  refreshTrigger,
}: CvQuotaDisplayProps) {
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotaStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const status = await cvImportService.getLimitStatus(userId);
      setQuotaStatus(status);
      setError(null);
    } catch (err) {
      console.error("Error al obtener el estado de la cuota:", err);
      setError("Error al cargar cuota");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Cargar estado inicial
  useEffect(() => {
    if (userId) {
      fetchQuotaStatus();
    }
  }, [userId, fetchQuotaStatus]);

  // Actualizar cuando cambie refreshTrigger
  useEffect(() => {
    if (refreshTrigger && userId) {
      fetchQuotaStatus();
    }
  }, [refreshTrigger, userId, fetchQuotaStatus]);

  // Mostrar loader solo si ya sabemos que es cuenta demo
  if (isLoading) {
    // No mostrar nada durante la carga inicial
    return null;
  }

  // No mostrar nada si no es cuenta demo
  if (quotaStatus && !quotaStatus.isDemo) {
    return null;
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-red-500/50 bg-darkPurple/50 px-2.5 py-1.5 backdrop-blur-sm">
        <AiOutlineFileText className="h-3.5 w-3.5 text-red-400" />
        <span className="text-xs text-red-300">{error}</span>
      </div>
    );
  }

  // No mostrar nada si no hay datos
  if (!quotaStatus) {
    return null;
  }

  // Calcular el porcentaje usado
  const percentageUsed = (quotaStatus.processedCvs / quotaStatus.maxCvs) * 100;

  // Determinar el color de la barra y texto basado en el porcentaje
  const getProgressBarColor = () => {
    if (quotaStatus.isBlocked) return "bg-red-500";
    if (percentageUsed >= 90)
      return "bg-gradient-to-r from-orange-500 to-red-500";
    if (percentageUsed >= 70)
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    return "bg-gradient-primary";
  };

  const getIconColor = () => {
    if (quotaStatus.isBlocked) return "text-red-400";
    if (percentageUsed >= 90) return "text-orange-400";
    if (percentageUsed >= 70) return "text-yellow-300";
    return "text-taleniaBlue";
  };

  return (
    <Tooltip
      content={
        <div className="px-1 py-2">
          <div className="text-small font-bold text-darkPurple">
            Cuenta Demo
          </div>
          <div className="text-tiny text-gray-600">
            {quotaStatus.isBlocked ? (
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-red-600">
                  ⚠️ Cuenta bloqueada
                </span>
                <span className="text-red-500">
                  Múltiples intentos fallidos de procesamiento.
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  Contacta con soporte para reactivarla.
                </span>
              </div>
            ) : (
              <>
                Has usado {quotaStatus.processedCvs} de {quotaStatus.maxCvs} CVs
                disponibles.
                {quotaStatus.failedCvs > 0 && (
                  <div className="mt-1 text-orange-500">
                    {quotaStatus.failedCvs} CV(s) fallidos
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      }
      placement="bottom"
      closeDelay={100}
    >
      <div
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 backdrop-blur-sm transition-all ${
          quotaStatus.isBlocked
            ? "border border-red-500/50 bg-red-950/30 hover:border-red-500/70"
            : "border border-purple/30 bg-lightGray hover:border-customPurple/50"
        }`}
      >
        {quotaStatus.isBlocked ? (
          <MdBlock className="h-4 w-4 animate-pulse text-red-400" />
        ) : (
          <AiOutlineFileText className={`h-4 w-4 ${getIconColor()}`} />
        )}

        <div className="flex min-w-32 flex-col gap-0.5">
          {/* Contador */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] ${
                quotaStatus.isBlocked ? "text-red-300/70" : "text-white"
              }`}
            >
              {quotaStatus.isBlocked ? "Estado bloqueado" : "Cuota de uso"}
            </span>
            <span
              className={`text-xs font-semibold ${
                quotaStatus.isBlocked ? "text-red-400" : "text-white"
              }`}
            >
              {!quotaStatus.isBlocked && (
                <>
                  {quotaStatus.processedCvs} / {quotaStatus.maxCvs}
                </>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className={`h-1 w-full overflow-hidden rounded-full ${
              quotaStatus.isBlocked ? "bg-red-950/50" : "bg-darkPurple"
            }`}
          >
            <div
              className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{
                width: quotaStatus.isBlocked
                  ? "100%"
                  : `${Math.min(percentageUsed, 100)}%`,
              }}
            />
          </div>
        </div>

        {quotaStatus.processedCvs == 20 && (
          <span className="absolute -top-1 right-2 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
        )}
      </div>
    </Tooltip>
  );
}
