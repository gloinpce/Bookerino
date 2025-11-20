import React from "react";
import { useUser, useStackApp, UserButton } from "@stackframe/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useUser();
  const app = useStackApp();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Nu sunteți autentificat</CardTitle>
              <CardDescription>
                Vă rugăm să vă autentificați pentru a accesa profilul dvs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={() => app.redirectToSignIn()} className="flex-1">
                  Autentificare
                </Button>
                <Button onClick={() => app.redirectToSignUp()} variant="outline" className="flex-1">
                  Înregistrare
                </Button>
              </div>
              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:underline">
                  ← Înapoi la pagina principală
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Profilul meu</CardTitle>
                  <CardDescription>
                    Gestionați informațiile contului dvs.
                  </CardDescription>
                </div>
                <UserButton />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Nume afișat</Label>
                <div className="flex items-center gap-4">
                  <Input
                    defaultValue={user.displayName ?? "Utilizator fără nume"}
                    disabled
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const newName = prompt("Introduceți noul nume:", user.displayName ?? "");
                      if (newName !== null && newName !== user.displayName) {
                        await user.update({ displayName: newName });
                        window.location.reload(); // Refresh to show updated name
                      }
                    }}
                  >
                    Modifică
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adresă de email</Label>
                <Input
                  value={user.primaryEmail ?? "N/A"}
                  disabled
                  className="flex-1"
                />
                <p className="text-sm text-muted-foreground">
                  Email-ul nu poate fi modificat din această pagină
                </p>
              </div>

              <div className="space-y-2">
                <Label>ID utilizator</Label>
                <Input
                  value={user.id ?? "N/A"}
                  disabled
                  className="flex-1 font-mono text-sm"
                />
              </div>

              {user.clientMetadata && Object.keys(user.clientMetadata).length > 0 && (
                <div className="space-y-2">
                  <Label>Metadate personalizate</Label>
                  <pre className="p-4 bg-muted rounded-md text-sm overflow-auto">
                    {JSON.stringify(user.clientMetadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (confirm("Sunteți sigur că doriți să vă deconectați?")) {
                      await user.signOut();
                    }
                  }}
                  className="w-full"
                >
                  Deconectare
                </Button>
              </div>

              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:underline">
                  ← Înapoi la pagina principală
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

