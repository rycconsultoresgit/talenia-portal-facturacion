"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { CvQuotaProvider } from "./context/CvQuotaContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CvQuotaProvider>
        <Toaster position="bottom-right" richColors />
        {children}
      </CvQuotaProvider>
    </AuthProvider>
  );
}
