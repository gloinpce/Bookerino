import React, { useState, FormEvent, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Check, Mail, Lock, User } from "lucide-react";
import { useUser, useStackApp } from "@stackframe/react";
import type { Result } from "@stackframe/react";
import { debug } from "../config/database";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"password" | "otp" | "oauth">("password");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  // Handle OAuth callback with comprehensive error handling
  useEffect(() => {
    if (!isOAuthCallback) return;

    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      // Handle OAuth provider errors (user denied, etc.)
      if (error) {
        setLoading(false);
        setError(
          errorDescription || 
          error === "access_denied" 
            ? "Autentificarea a fost anulată. Vă rugăm să încercați din nou." 
            : `Eroare OAuth: ${error}`
        );
        setAuthMethod("oauth");
        // Clean URL
        window.history.replaceState({}, document.title, "/oauth");
        return;
      }

      // Check for required OAuth parameters
      if (!code || !state) {
        setLoading(false);
        setError("Parametri OAuth lipsă. Vă rugăm să încercați din nou.");
        setAuthMethod("oauth");
        navigate("/auth");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use SDK callOAuthCallback method with Result type
        const result: Result<any, any> = await app.callOAuthCallback();
        
        if (result.status === "success") {
          // Success - user is signed in via OAuth
          navigate("/", { replace: true });
        } else {
          // Handle SDK error types
          const errorMessage = result.error?.message || result.error || "Autentificarea OAuth a eșuat.";
          const errorCode = result.error?.code;
          
          // Check for specific SDK error codes
          if (errorCode === "OAuthAccountAlreadyLinked" || errorMessage.includes("duplicate") || errorMessage.includes("already exists")) {
            setError(
              "Un cont cu această adresă de email există deja. " +
              "Vă rugăm să vă autentificați cu email și parolă sau să conectați contul OAuth din setări."
            );
          } else if (errorCode === "OAuthAccountLinkFailed" || errorMessage.includes("link") || errorMessage.includes("verification")) {
            setError(
              "Nu s-a putut conecta contul OAuth. " +
              "Asigurați-vă că adresa de email este verificată și încercați din nou."
            );
          } else if (errorCode === "OAuthProviderError") {
            setError("Eroare de la providerul OAuth. Vă rugăm să încercați din nou.");
          } else {
            setError(`Autentificare eșuată: ${errorMessage}`);
          }
          
          setAuthMethod("oauth");
          // Clean URL
          window.history.replaceState({}, document.title, "/oauth");
        }
      } catch (err) {
        // Network or unexpected errors
        const errorMessage = err instanceof Error ? err.message : "Eroare necunoscută";
        
        if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
          setError("Nu s-a putut conecta la server. Verificați conexiunea la internet și încercați din nou.");
        } else {
          setError(`A apărut o eroare la autentificare: ${errorMessage}`);
        }
        
        setAuthMethod("oauth");
        if (debug) {
          console.error("OAuth callback error:", err);
        }
        // Clean URL
        window.history.replaceState({}, document.title, "/oauth");
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [app, navigate, isOAuthCallback, debug]);

  // Show loading state for OAuth callback
  if (isOAuthCallback && loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle pt-24 pb-20 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Se procesează autentificarea OAuth...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-3 bg-green-500/10 text-green-600 dark:text-green-400 text-sm rounded-md">
                  {successMessage}
                </div>
              )}

              {/* Auth Method Selector - Hide on OAuth callback */}
              {!isOAuthCallback && (
                <div className="mb-4 flex gap-2">
                  <Button
                    type="button"
                    variant={authMethod === "password" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setAuthMethod("password");
                      setOtpStep("email");
                      setError(null);
                    }}
                    className="flex-1"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Parolă
                  </Button>
                  <Button
                    type="button"
                    variant={authMethod === "otp" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setAuthMethod("otp");
                      setOtpStep("email");
                      setError(null);
                    }}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Cod email
                  </Button>
                  <Button
                    type="button"
                    variant={authMethod === "oauth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setAuthMethod("oauth");
                      setError(null);
                    }}
                    className="flex-1"
                  >
                    OAuth
                  </Button>
                </div>
              )}

              {/* Show OAuth method if on OAuth callback page */}
              {isOAuthCallback && authMethod !== "oauth" && (
                <div className="mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/auth")}
                  >
                    ← Înapoi la autentificare
                  </Button>
                </div>
              )}

              {/* Password Authentication Form */}
              {authMethod === "password" && (
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
                      
                      // Use SDK signInWithCredential with noRedirect to handle navigation manually
                      const result: Result<undefined, any> = await app.signInWithCredential({
                        email,
                        password,
                        noRedirect: true, // Prevent automatic redirect, handle it manually
                      });
                      
                      if (result.status === "error") {
                        // Handle SDK error types
                        const errorMessage = result.error?.message || result.error || "Autentificare eșuată. Verificați email-ul și parola.";
                        
                        // Check for specific error types
                        if (result.error?.code === "EmailPasswordMismatch") {
                          setError("Email sau parolă incorectă. Vă rugăm să încercați din nou.");
                        } else {
                          setError(errorMessage);
                        }
                      } else {
                        // Success - user is now signed in
                        navigate("/", { replace: true });
                      }
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
                      
                      // Use SDK signUpWithCredential with noRedirect
                      const result: Result<undefined, any> = await app.signUpWithCredential({
                        email,
                        password,
                        displayName: name,
                        noRedirect: true, // Prevent automatic redirect
                      });
                      
                      if (result.status === "error") {
                        // Handle SDK error types
                        const errorMessage = result.error?.message || result.error || "Înregistrare eșuată.";
                        
                        if (result.error?.code === "UserWithEmailAlreadyExists") {
                          setError("Un cont cu această adresă de email există deja. Vă rugăm să vă autentificați.");
                          setIsLogin(true);
                        } else if (result.error?.code === "PasswordRequirementsNotMet") {
                          setError("Parola nu îndeplinește cerințele minime. Vă rugăm să folosiți o parolă mai puternică.");
                        } else {
                          setError(errorMessage);
                        }
                      } else {
                        // Success - auto sign-in after sign-up
                        const signInResult: Result<undefined, any> = await app.signInWithCredential({
                          email,
                          password,
                          noRedirect: true,
                        });
                        
                        if (signInResult.status === "error") {
                          setError("Cont creat cu succes! Vă rugăm să vă autentificați manual.");
                          setIsLogin(true);
                        } else {
                          navigate("/", { replace: true });
                        }
                      }
                    }
                  } catch (err) {
                    // Handle unexpected errors
                    const errorMessage = err instanceof Error ? err.message : "A apărut o eroare neașteptată";
                    setError(errorMessage);
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
                    <button
                      type="button"
                      onClick={async () => {
                        const emailInput = document.getElementById("email") as HTMLInputElement;
                        const email = emailInput.value;
                        
                        if (!email) {
                          setError("Vă rugăm să introduceți adresa de email pentru resetarea parolei");
                          return;
                        }
                        
                        setLoading(true);
                        setError(null);
                        setSuccessMessage(null);
                        
                        try {
                          // Use SDK sendForgotPasswordEmail method
                          const result: Result<undefined, any> = await app.sendForgotPasswordEmail(email);
                          
                          if (result.status === "error") {
                            const errorMessage = result.error?.message || result.error || "Eroare la trimiterea email-ului de resetare";
                            
                            if (result.error?.code === "UserNotFound") {
                              setError("Nu există un cont cu această adresă de email.");
                            } else {
                              setError(errorMessage);
                            }
                          } else {
                            setSuccessMessage(`Email de resetare parolă trimis la ${email}. Verificați inbox-ul.`);
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Eroare la trimiterea email-ului");
                          if (debug) {
                            console.error("Forgot password error:", err);
                          }
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Ați uitat parola?
                    </button>
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
              )}

              {/* OTP/Magic Link Authentication Form */}
              {authMethod === "otp" && (
                <div className="space-y-4">
                  {otpStep === "email" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp-email">Adresă de email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="otp-email"
                            type="email"
                            placeholder="email@exemplu.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        disabled={loading}
                        onClick={async () => {
                          const emailInput = document.getElementById("otp-email") as HTMLInputElement;
                          const email = emailInput.value;
                          
                          if (!email) {
                            setError("Vă rugăm să introduceți adresa de email");
                            return;
                          }
                          
                          setLoading(true);
                          setError(null);
                          
                          try {
                            // Use SDK sendMagicLinkEmail method (takes email as string, not object)
                            const result: Result<{ nonce: string }, any> = await app.sendMagicLinkEmail(email);
                            
                            if (result.status === "error") {
                              const errorMessage = result.error?.message || result.error || "Eroare la trimiterea codului";
                              
                              if (result.error?.code === "RedirectUrlNotWhitelisted") {
                                setError("URL-ul de redirecționare nu este permis. Contactați suportul.");
                              } else {
                                setError(errorMessage);
                              }
                            } else {
                              setSuccessMessage(`Cod de autentificare trimis la ${email}`);
                              setOtpStep("code");
                            }
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Eroare la trimiterea codului");
                            if (debug) {
                              console.error("Send magic link error:", err);
                            }
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        {loading ? "Se trimite..." : "Trimite cod"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp-code">Cod de autentificare</Label>
                        <Input
                          id="otp-code"
                          type="text"
                          placeholder="Introduceți codul din email"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Verificați email-ul pentru codul de autentificare
                        </p>
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        disabled={loading}
                        onClick={async () => {
                          const codeInput = document.getElementById("otp-code") as HTMLInputElement;
                          const code = codeInput.value;
                          
                          if (!code) {
                            setError("Vă rugăm să introduceți codul");
                            return;
                          }
                          
                          setLoading(true);
                          setError(null);
                          
                          try {
                            // Use SDK signInWithMagicLink method
                            // Note: signInWithMagicLink may use different parameter name
                            // Check SDK docs - it might be 'code' or 'nonce'
                            const result: Result<any, any> = await app.signInWithMagicLink({ code });
                            
                            if (result.status === "error") {
                              const errorMessage = result.error?.message || result.error || "Verificare eșuată. Verificați codul și încercați din nou.";
                              setError(errorMessage);
                            } else {
                              // Success - user is signed in
                              navigate("/", { replace: true });
                            }
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Eroare la verificare");
                            if (debug) {
                              console.error("Magic link sign in error:", err);
                            }
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        {loading ? "Se verifică..." : "Verifică cod"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setOtpStep("email");
                          setError(null);
                          setSuccessMessage(null);
                        }}
                      >
                        ← Înapoi
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* OAuth Authentication */}
              {authMethod === "oauth" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Autentificați-vă folosind unul dintre providerii OAuth
                  </p>
                  <Button
                    type="button"
                    className="w-full"
                    variant="outline"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      setSuccessMessage(null);
                      
                      try {
                        // Use SDK signInWithOAuth method
                        // This initiates OAuth flow and redirects to provider
                        await app.signInWithOAuth("google");
                        // Note: User will be redirected to Google's authorization page
                        // After authorization, Google redirects back to /oauth
                        // The OAuth callback handler (useEffect above) will process the result
                        // This code may not execute if redirect happens immediately
                      } catch (err) {
                        setLoading(false);
                        const errorMessage = err instanceof Error ? err.message : "Eroare necunoscută";
                        
                        if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
                          setError("Nu s-a putut conecta la serverul OAuth. Verificați conexiunea la internet.");
                        } else if (errorMessage.includes("popup") || errorMessage.includes("blocked")) {
                          setError("Popup-ul a fost blocat. Vă rugăm să permiteți popup-uri pentru acest site.");
                        } else {
                          setError(`Eroare la inițializarea autentificării Google: ${errorMessage}`);
                        }
                        
                        if (debug) {
                          console.error("Google OAuth initialization error:", err);
                        }
                      }
                    }}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {loading ? "Se procesează..." : "Autentificare cu Google"}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Alți provideri OAuth vor fi disponibili în curând
                  </div>
                </div>
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

