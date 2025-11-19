import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <AnimatedBackground />
      <Card className="w-full max-w-md shadow-lg-custom relative z-10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Plată Anulată</h1>
            <p className="text-muted-foreground">
              Plata a fost anulată. Nu s-a efectuat nicio taxare pe cardul tău.
            </p>
            <div className="pt-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>Ai schimbat decizia? Nicio problemă!</p>
                <p>Poți reveni oricând pentru a completa abonamentul.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/pricing">Vezi Planuri</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/">Pagina Principală</Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Ai întrebări? <a href="mailto:contact@bookerino.net" className="text-primary hover:underline">Contactează-ne</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;

