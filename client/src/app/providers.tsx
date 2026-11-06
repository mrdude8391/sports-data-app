import AuthProvider from "@/context/AuthProvider.tsx";
import { ThemeProvider } from "@/context/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
