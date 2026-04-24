import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { PrimeReactProvider} from "primereact/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light">
      <PrimeReactProvider>
        <App />
        <Toaster position="top-right" duration={3000} richColors />
      </PrimeReactProvider>
    </ThemeProvider>
  </StrictMode>,
);
