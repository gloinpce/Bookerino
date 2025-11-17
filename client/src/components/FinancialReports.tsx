import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export function FinancialReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rapoarte Financiare</h1>
        <p className="text-muted-foreground mt-1">Venituri, cheltuieli și profit</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Venituri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 RON</div>
            <p className="text-sm text-muted-foreground mt-2">Total venituri</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Cheltuieli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 RON</div>
            <p className="text-sm text-muted-foreground mt-2">Total cheltuieli</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 RON</div>
            <p className="text-sm text-muted-foreground mt-2">Profit net</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Evoluție Financiară</CardTitle>
          <CardDescription>
            Graficele vor apărea aici când vei avea date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nu există date financiare
            </h3>
            <p className="text-sm text-muted-foreground">
              Rapoarte financiare vor fi disponibile după ce adaugi rezervări
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
