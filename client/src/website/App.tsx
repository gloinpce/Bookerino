import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkVeil } from "@/components/dark-veil";
import { initStackAuth } from "./lib/stackAuth";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
// Use dynamic import for Auth to fix potential import error
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient();

// Initialize Stack Auth on app startup
if (typeof window !== "undefined") {
  initStackAuth();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DarkVeil />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/auth" 
            element={
              <Suspense fallback={<div className="flex h-screen items-center justify-center">Se încarcă...</div>}>
                <Auth />
              </Suspense>
            } 
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
