import { Component, ErrorInfo, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("React error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: "#ff4444", background: "#111", minHeight: "100vh", fontFamily: "monospace" }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", color: "#888", marginTop: 16 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
