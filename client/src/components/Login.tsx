import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "./ui/sonner";

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vă rugăm completați toate câmpurile");
      return;
    }

    setIsLoading(true);

    try {
      // Try API call first
      const response = await fetch("https://api.bookerino.ro/desktop-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          app_version: "1.0.0",
          platform: "desktop",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("bookerino_auth_token", data.token);
        localStorage.setItem("bookerino_user", JSON.stringify(data.user));
        setIsLoading(false);
        toast.success("Autentificare reușită!");
        onLoginSuccess(data.user);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Eroare la autentificare. Verificați conexiunea la internet.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg-custom animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Bookerino
          </CardTitle>
          <CardDescription className="text-lg">
            Sistem de Gestionare HoReCa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="orice@exemplu.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Parolă
              </label>
              <Input
                id="password"
                type="password"
                placeholder="orice123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-hero hover:opacity-90 text-white shadow-card"
              size="lg"
            >
              {isLoading ? "Se conectează..." : "Conectează-te"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
