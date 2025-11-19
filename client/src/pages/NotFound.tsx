import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-lg-custom">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-8xl font-bold text-primary/20">404</div>
            <h1 className="text-3xl font-bold">Pagina nu a fost găsită</h1>
            <p className="text-muted-foreground">
              Pagina pe care o cauți nu există sau a fost mutată.
            </p>
            <div className="pt-4">
              <Button asChild className="w-full" size="lg">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Mergi la Pagina Principală
                </Link>
              </Button>
            </div>
            <div className="pt-4 text-sm text-muted-foreground">
              <p>Sau poți încerca:</p>
              <div className="flex justify-center gap-4 mt-2">
                <Link to="/pricing" className="text-primary hover:underline">
                  Prețuri
                </Link>
                <Link to="/auth" className="text-primary hover:underline">
                  Autentificare
                </Link>
                <a href="/#contact" className="text-primary hover:underline">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

