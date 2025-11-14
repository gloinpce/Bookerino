import { useState, FormEvent, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { authApi } from "../lib/api";
import { debug } from "../config/database";
import { initStackAuth } from "../lib/stackAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize Stack Auth on component mount
  useEffect(() => {
    initStackAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Auth Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {isLogin ? "Autentificare" : "Înregistrare"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? "Accesați contul dvs. Bookerino" 
                  : "Începeți perioada de probă gratuită de 7 zile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              <form 
                className="space-y-4"
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);
                  
                  const formData = new FormData(e.currentTarget);
                  
                  try {
                    if (isLogin) {
                      const email = formData.get("email") as string;
                      const password = formData.get("password") as string;
                      
                      if (debug) {
                        console.log("Attempting login for:", email);
                      }
                      
                      await authApi.login(email, password);
                      navigate("/");
                    } else {
                      const name = formData.get("name") as string;
                      const email = formData.get("email") as string;
                      const password = formData.get("password") as string;
                      const confirmPassword = formData.get("confirm-password") as string;
                      
                      if (password !== confirmPassword) {
                        setError("Parolele nu se potrivesc");
                        setLoading(false);
                        return;
                      }
                      
                      if (debug) {
                        console.log("Attempting registration for:", email);
                      }
                      
                      await authApi.register({ name, email, password });
                      navigate("/");
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "A apărut o eroare");
                    if (debug) {
                      console.error("Auth error:", err);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume complet</Label>
                    <Input id="name" name="name" required />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresă de email</Label>
                  <Input type="email" id="email" name="email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Parolă</Label>
                  <Input type="password" id="password" name="password" required />
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmare parolă</Label>
                    <Input type="password" id="confirm-password" name="confirm-password" required />
                  </div>
                )}
                
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" name="remember" />
                      <Label htmlFor="remember" className="cursor-pointer">
                        Ține-mă minte
                      </Label>
                    </div>
                    <Link to="#" className="text-sm text-primary hover:underline">
                      Ați uitat parola?
                    </Link>
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading 
                    ? "Se procesează..." 
                    : isLogin 
                      ? "Autentificare" 
                      : "Începeți perioada de probă"}
                </Button>
                
                <div className="text-center text-sm">
                  {isLogin ? (
                    <p>
                      Nu aveți un cont?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-primary hover:underline"
                      >
                        Înregistrați-vă aici
                      </button>
                    </p>
                  ) : (
                    <p>
                      Aveți deja un cont?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-primary hover:underline"
                      >
                        Autentificați-vă aici
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Info Section */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isLogin ? "Conectați-vă la aplicație" : "De ce să vă înregistrați?"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Panoul de control al afacerii</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Rapoarte și analize</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Setările contului</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Gestionarea abonamentului</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Perioadă de probă gratuită de 7 zile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acces la toate funcționalitățile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Fără obligații de plată în perioada de probă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Suport dedicat pentru noii clienți</span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/" className="text-muted-foreground hover:underline">
            ← Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;

