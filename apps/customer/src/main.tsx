import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@repo/ui/main.css";
import "../main.css";
import App from "./App.tsx";
import { Toaster, ThemeProvider } from "@ui/components";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="relative max-w-[450px] mx-auto">
          <App />
        </div>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
