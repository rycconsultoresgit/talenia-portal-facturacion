"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { CvQuotaProvider } from "./context/CvQuotaContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CvQuotaProvider>
        <Toaster position="bottom-right" richColors />
        {children}
      </CvQuotaProvider>
      </QueryClientProvider>
      
    </AuthProvider>
  );
}
