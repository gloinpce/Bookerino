/**
 * NOTE: This is a reference file for Figma design purposes.
 * These files are copies of the actual source code and are not meant to compile.
 * TypeScript errors are expected as dependencies are not available in this folder.
 * For the actual working code, see: client/src/website/pages/Cancel.tsx
 */

import React from "react";
// @ts-ignore - Reference file, dependencies not available
import { Card, CardContent } from "@/components/ui/card";
// @ts-ignore - Reference file, dependencies not available
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Plată Anulată</h1>
            <p className="text-muted-foreground">
              Plata a fost anulată. Nu s-a efectuat nicio taxare.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/pricing">Vezi Planuri</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/">Pagina Principală</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;

