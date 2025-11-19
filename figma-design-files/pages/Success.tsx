import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Download } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 pt-24">
      <AnimatedBackground />
      <Card className="w-full max-w-md shadow-lg-custom relative z-10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Plată Reușită!</h1>
            <p className="text-muted-foreground">
              Mulțumim pentru abonamentul tău la Bookerino. Contul tău a fost activat cu succes.
            </p>
            <div className="pt-4 space-y-3">
              <div className="text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-primary mb-2">Următorii pași:</p>
                <p>✓ Vei primi un email de confirmare</p>
                <p>✓ Descarcă aplicația Bookerino Desktop</p>
                <p>✓ Începe să gestionezi afacerea ta</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link to="/dashboard">
                  <Download className="mr-2 h-4 w-4" />
                  Descarcă Aplicația
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/">Înapoi la Pagina Principală</Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Ai întrebări? <a href="mailto:ferinogroup@gmail.com" className="text-primary hover:underline">Contactează-ne</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
