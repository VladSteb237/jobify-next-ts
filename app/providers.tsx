"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
        },
      },
    });
  });
  return (
    <React.Fragment>
      <ThemeProvider
        attribute={"class"}
        defaultTheme={"system"}
        enableSystem
        disableTransitionOnChange>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Providers;
