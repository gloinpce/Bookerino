/**
 * NOTE: This is a reference file for Figma design purposes.
 * These files are copies of the actual source code and are not meant to compile.
 * TypeScript errors are expected as dependencies are not available in this folder.
 * For the actual working code, see: client/src/website/pages/Success.tsx
 */

import React from "react";
// @ts-ignore - Reference file, dependencies not available
import { Card, CardContent } from "@/components/ui/card";
// @ts-ignore - Reference file, dependencies not available
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">Plată Reușită!</h1>
            <p className="text-muted-foreground">
              Mulțumim pentru abonamentul tău. Contul tău a fost activat cu succes.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Mergi la Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;

