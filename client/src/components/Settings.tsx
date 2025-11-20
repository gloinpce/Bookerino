import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "./ui/sonner";

interface SettingsProps {
  user?: any;
}

export function Settings({ user }: SettingsProps) {
  const handleSave = (platform: string) => {
    toast.success(`Setările pentru ${platform} au fost salvate!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Setări</h1>
        <p className="text-muted-foreground mt-1">Configurează integrările API și setările aplicației</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrări API</TabsTrigger>
          <TabsTrigger value="general">Setări Generale</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {/* Google Ads */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Google Ads</CardTitle>
              <CardDescription>
                Conectează contul Google Ads pentru gestionarea campaniilor publicitare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-ads-key">API Key</Label>
                <Input id="google-ads-key" placeholder="Introdu API Key" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activează integrare</Label>
                  <p className="text-sm text-muted-foreground">
                    Activează sincronizarea automată cu Google Ads
                  </p>
                </div>
                <Switch />
              </div>
              <Button onClick={() => handleSave("Google Ads")} className="bg-gradient-hero hover:opacity-90 text-white shadow-card">
                Salvează Setări
              </Button>
            </CardContent>
          </Card>

          {/* Booking.com */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Booking.com</CardTitle>
              <CardDescription>
                Conectează contul Booking.com pentru sincronizare automată rezervări
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="booking-email">Email</Label>
                <Input id="booking-email" type="email" placeholder="email@booking.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-password">Parolă</Label>
                <Input id="booking-password" type="password" placeholder="Parolă" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activează sincronizare</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizare automată la fiecare oră
                  </p>
                </div>
                <Switch />
              </div>
              <Button onClick={() => handleSave("Booking.com")} className="bg-gradient-hero hover:opacity-90 text-white shadow-card">
                Salvează Setări
              </Button>
            </CardContent>
          </Card>

          {/* Expedia */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Expedia</CardTitle>
              <CardDescription>
                Conectează contul Expedia pentru sincronizare automată rezervări
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expedia-email">Email</Label>
                <Input id="expedia-email" type="email" placeholder="email@expedia.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expedia-password">Parolă</Label>
                <Input id="expedia-password" type="password" placeholder="Parolă" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activează sincronizare</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizare automată la fiecare oră
                  </p>
                </div>
                <Switch />
              </div>
              <Button onClick={() => handleSave("Expedia")} className="bg-gradient-hero hover:opacity-90 text-white shadow-card">
                Salvează Setări
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Informații Proprietate</CardTitle>
              <CardDescription>
                Actualizează informațiile despre proprietatea ta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property-name">Nume Proprietate</Label>
                <Input 
                  id="property-name" 
                  defaultValue={user?.propertyName || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-location">Locație</Label>
                <Input 
                  id="property-location" 
                  defaultValue={user?.propertyLocation || "București"} 
                />
              </div>
              <Button className="bg-gradient-hero hover:opacity-90 text-white shadow-card">
                Salvează Modificări
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
