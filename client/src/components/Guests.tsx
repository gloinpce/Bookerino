import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Users, Plus } from "lucide-react";

export function Guests() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Oaspeți</h1>
          <p className="text-muted-foreground mt-1">Gestionează baza de date oaspeți</p>
        </div>
        <Button className="bg-gradient-hero hover:opacity-90 text-white shadow-card">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă Oaspete
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input placeholder="Caută oaspeți..." />
        </div>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Lista Oaspeților</CardTitle>
          <CardDescription>
            Toți oaspeții tăi vor apărea aici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nu există oaspeți
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Oaspeții vor fi adăugați automat când creezi rezervări
            </p>
            <Button className="bg-gradient-hero hover:opacity-90 text-white shadow-card">
              <Plus className="mr-2 h-4 w-4" />
              Adaugă Oaspete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
