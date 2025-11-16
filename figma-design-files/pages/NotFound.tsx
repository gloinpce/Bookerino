import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Pagina nu a fost găsită</h2>
            <p className="text-muted-foreground">
              Pagina pe care o cauți nu există sau a fost mutată.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Mergi la Pagina Principală</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

