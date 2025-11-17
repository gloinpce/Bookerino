import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BarChart3, Calendar, Bed, Users, TrendingUp, DollarSign } from "lucide-react";

export function EmptyDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bine ai venit în Bookerino!</h1>
        <p className="text-muted-foreground">
          Sistemul tău de management HoReCa este gata de utilizare.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Camere</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Adaugă camere pentru a începe</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rezervări</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Nicio rezervare încă</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venit Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00 RON</div>
            <p className="text-xs text-muted-foreground">Venituri totale</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Mediu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00/5</div>
            <p className="text-xs text-muted-foreground">Pe baza recenziilor</p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Începe să folosești Bookerino</CardTitle>
          <CardDescription>
            Acesta este un dashboard informațional. Pentru a vedea date reale, conectează-te la backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Pași următori:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Adaugă camere în secțiunea "Camere"</li>
              <li>Creează rezervări în secțiunea "Rezervări"</li>
              <li>Gestionează oaspeții în secțiunea "Oaspeți"</li>
              <li>Configurează integrările API în "Setări"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
