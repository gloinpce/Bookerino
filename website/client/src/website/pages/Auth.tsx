import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
              <form className="space-y-4">
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
                
                <Button type="submit" className="w-full">
                  {isLogin ? "Autentificare" : "Începeți perioada de probă"}
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

