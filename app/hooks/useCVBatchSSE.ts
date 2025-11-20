import { SSEEvent, SseEventType } from "@/app/types/sse.types";
import { useEffect, useRef } from "react";

interface UseSSEOptions {
  batchId: string;
  onEvent: (event: SSEEvent) => void;
  setLoad: () => void;
}

export function useSSE({ batchId, onEvent, setLoad }: UseSSEOptions) {
  // Usamos useRef para mantener referencias estables a las funciones de callback
  const onEventRef = useRef(onEvent);
  const setLoadRef = useRef(setLoad);

  // Actualizamos las referencias cuando cambian los callbacks
  useEffect(() => {
    onEventRef.current = onEvent;
    setLoadRef.current = setLoad;
  }, [onEvent, setLoad]);

  useEffect(() => {
    if (!batchId) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_CV_PROCESS_URL;
    const eventSource = new EventSource(`${apiUrl}/events-cv/batch/${batchId}`);
    let isMounted = true;

    const handleEvent = (msgEvent: MessageEvent) => {
      if (!isMounted) return;

      try {
        const data = JSON.parse(msgEvent.data);
        onEventRef.current({ type: msgEvent.type as SseEventType, data });

        // Cerrar la conexión cuando se reciba batch_completed
        if (msgEvent.type === "batch_completed") {
          setLoadRef.current();
          eventSource.close();
        }
      } catch (e) {
        console.error("Error procesando evento SSE:", e);
      }
    };

    // Manejador para eventos con nombre (event: cv_created)
    eventSource.addEventListener("cv_created", handleEvent);

    // Manejador para eventos con nombre (event: batch_completed)
    eventSource.addEventListener("batch_completed", handleEvent);

    // Manejador genérico para mensajes sin tipo específico
    eventSource.onmessage = handleEvent;

    eventSource.onopen = () => {
      console.log("Conexión SSE establecida");
    };

    eventSource.onerror = (error) => {
      console.error("Error en conexión SSE:", error);
      // Cerramos la conexión al primer error
      eventSource.close();
    };

    // Limpieza al desmontar el componente
    return () => {
      console.log("Cerrando conexión SSE");
      isMounted = false;
      eventSource.close();
    };
  }, [batchId]); // Se ejecuta solo una vez al montar el componente
}
