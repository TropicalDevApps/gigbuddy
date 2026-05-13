import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-deep text-text-bright flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-[#FF0000]">
              Algo Salió Mal
            </h1>
            <p className="text-text-dim text-sm pb-4">
              Hemos encontrado un error inesperado. Por favor recarga la página.
              Si el problema persiste, contacta a soporte.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand text-brand-contrast px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all w-full"
            >
              Recargar gigBuddy
            </button>
            {this.state.error && (
              <div className="mt-8 p-4 bg-black/40 rounded-lg text-left overflow-auto max-h-48 border border-white/5">
                <pre className="text-[9px] text-red-400 font-mono">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
