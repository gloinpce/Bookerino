import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";

export function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analiză Performanță</h1>
        <p className="text-muted-foreground mt-1">Statistici și metrici de performanță</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              ADR (Average Daily Rate)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 RON</div>
            <p className="text-sm text-muted-foreground mt-2">Preț mediu pe cameră</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              RevPAR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 RON</div>
            <p className="text-sm text-muted-foreground mt-2">Revenue per Available Room</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader>
            <CardTitle>Rata Ocupare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-sm text-muted-foreground mt-2">Procent camere ocupate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Grafice Performanță</CardTitle>
          <CardDescription>
            Graficele vor apărea aici când vei avea date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nu există date pentru analiză
            </h3>
            <p className="text-sm text-muted-foreground">
              Adaugă rezervări și camere pentru a vedea statistici
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
