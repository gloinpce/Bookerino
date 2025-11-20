import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkVeil } from "@/components/dark-veil";
import { StackProvider } from "@stackframe/react";
import { stackClientApp } from "./lib/stackClient";
import { ProductionBanner } from "./components/ProductionBanner";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OAuthErrorBoundary } from "./components/OAuthErrorBoundary";
// Use dynamic import for Auth to fix potential import error
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient();

const App = () => (
  <StackProvider app={stackClientApp}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DarkVeil />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OAuthErrorBoundary>
            <ProductionBanner />
            <Navbar />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lander" element={<Index />} />
            <Route 
              path="/auth" 
              element={
                <Suspense fallback={<div className="flex h-screen items-center justify-center">Se încarcă...</div>}>
                  <Auth />
                </Suspense>
              } 
            />
            <Route 
              path="/oauth" 
              element={
                <Suspense fallback={<div className="flex h-screen items-center justify-center">Se procesează autentificarea...</div>}>
                  <Auth />
                </Suspense>
              } 
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </OAuthErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StackProvider>
);

export default App;
