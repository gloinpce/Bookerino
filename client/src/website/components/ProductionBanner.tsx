import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isProduction, validateProductionConfig } from "../lib/production";

/**
 * ProductionBanner component that displays production configuration status
 * Only shows in development mode to remind developers about production setup
 */
export const ProductionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  useEffect(() => {
    // Only show in development to remind about production setup
    if (!isProduction) {
      const result = validateProductionConfig();
      setValidation(result);
      setIsVisible(true);
    }
  }, []);

  if (!isVisible || !validation || isProduction) {
    return null;
  }

  return (
    <Alert
      className={`fixed bottom-4 right-4 max-w-md z-50 shadow-lg ${
        validation.errors.length > 0
          ? "border-destructive"
          : validation.warnings.length > 0
          ? "border-yellow-500"
          : "border-green-500"
      }`}
    >
      <div className="flex items-start gap-2">
        {validation.errors.length > 0 ? (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        ) : validation.warnings.length > 0 ? (
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
        <div className="flex-1">
          <AlertTitle>
            {validation.errors.length > 0
              ? "Production Configuration Issues"
              : validation.warnings.length > 0
              ? "Production Configuration Warnings"
              : "Development Mode"}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {validation.errors.length > 0 && (
              <div className="mb-2">
                <strong>Errors:</strong>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {validation.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="mb-2">
                <strong>Warnings:</strong>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {validation.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            {validation.errors.length === 0 &&
              validation.warnings.length === 0 && (
                <p className="text-sm">
                  All production checks passed. Ready for deployment.
                </p>
              )}
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

