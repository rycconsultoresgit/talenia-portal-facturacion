"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface CvQuotaContextType {
  refreshTrigger: number;
  refreshQuota: () => void;
}

const CvQuotaContext = createContext<CvQuotaContextType | undefined>(undefined);

export function CvQuotaProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshQuota = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <CvQuotaContext.Provider value={{ refreshTrigger, refreshQuota }}>
      {children}
    </CvQuotaContext.Provider>
  );
}

export function useCvQuota() {
  const context = useContext(CvQuotaContext);
  if (context === undefined) {
    throw new Error("useCvQuota must be used within a CvQuotaProvider");
  }
  return context;
}
