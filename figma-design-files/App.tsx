/**
 * NOTE: This is a reference file for Figma design purposes.
 * These files are copies of the actual source code and are not meant to compile.
 * TypeScript errors are expected as dependencies are not available in this folder.
 * For the actual working code, see: client/src/website/App.tsx
 */

import React, { lazy, Suspense } from "react";
// @ts-ignore - Reference file, dependencies not available
import { Toaster } from "@/components/ui/toaster";
// @ts-ignore - Reference file, dependencies not available
import { Toaster as Sonner } from "./components/ui/sonner";
// @ts-ignore - Reference file, dependencies not available
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// @ts-ignore - Reference file, dependencies not available
import { DarkVeil } from "@/components/dark-veil";
// @ts-ignore - Reference file, dependencies not available
import { initStackAuth } from "./lib/stackAuth";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
// Use dynamic import for Auth to fix potential import error
// @ts-ignore - Reference file, dependencies not available
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
