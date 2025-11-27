import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { useUser, useStackApp, CredentialSignIn, CredentialSignUp, OAuthButtonGroup } from "@stackframe/react";
import type { Result } from "@stackframe/react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();
  const app = useStackApp();
  const isOAuthCallback = location.pathname === "/oauth";

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isOAuthCallback) {
      navigate("/");
    }
  }, [user, navigate, isOAuthCallback]);

  // Handle OAuth callback
  useEffect(() => {
    if (!isOAuthCallback) return;

    const handleOAuthCallback = async () => {
      try {
        const result: Result<any, any> = await app.callOAuthCallback();
        if (result.status === "success") {
          navigate("/", { replace: true });
        } else {
          navigate("/auth");
        }
      } catch (err) {
        navigate("/auth");
      }
    };

    handleOAuthCallback();
  }, [app, navigate, isOAuthCallback]);

  return (
    <div className="min-h-screen bg-gradient-subtle pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Auth Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {isOAuthCallback 
                  ? "Autentificare OAuth" 
                  : isLogin 
                    ? "Autentificare" 
                    : "Înregistrare"}
              </CardTitle>
              <CardDescription>
                {isOAuthCallback
                  ? "Finalizarea autentificării OAuth"
                  : isLogin 
                    ? "Accesați contul dvs. Bookerino" 
                    : "Începeți perioada de probă gratuită de 7 zile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOAuthCallback ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Se procesează autentificarea OAuth...</p>
                </div>
              ) : (
                <>
                  {/* Email/Password Authentication */}
                  {isLogin ? (
                    <div className="space-y-6">
                      <CredentialSignIn />
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>
                      <OAuthButtonGroup />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <CredentialSignUp />
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                        </div>
                      </div>
                      <OAuthButtonGroup />
                    </div>
                  )}
                  
                  <div className="text-center text-sm mt-4">
                    {isLogin ? (
                      <p>
                        Nu aveți un cont?{" "}
                        <button
                          type="button"
                          onClick={() => setIsLogin(false)}
                          className="text-primary hover:underline font-medium"
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
                          className="text-primary hover:underline font-medium"
                        >
                          Autentificați-vă aici
                        </button>
                      </p>
                    )}
                  </div>
                </>
              )}
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

