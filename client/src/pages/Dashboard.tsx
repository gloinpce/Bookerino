import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Download, CheckCircle, FileCode, Laptop, Shield, Zap, HelpCircle, LogOut, Calendar, CreditCard, Settings } from "lucide-react";
import { stackAuth } from "../lib/stackAuth";
import AccountSheet from "../components/AccountSheet";
import AnimatedBackground from "../components/AnimatedBackground";
// @ts-ignore - Figma asset import
const logo = "/logo.png"; // Placeholder for Figma asset

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!stackAuth.isAuthenticated()) {
      navigate("/auth");
      return;
    }
    
    const userData = stackAuth.getUser();
    setUser(userData);
  }, [navigate]);

  const handleDownload = () => {
    setDownloading(true);
    
    // Create a link to download the Bookerino.jar file
    const link = document.createElement('a');
    link.href = '/Bookerino.jar';
    link.download = 'Bookerino.jar';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const handleLogout = () => {
    stackAuth.logout();
    navigate("/");
  };

  const systemRequirements = [
    { label: "Java Runtime", value: "JRE 11 sau mai nou" },
    { label: "Sistem de operare", value: "Windows, macOS, Linux" },
    { label: "RAM minim", value: "4 GB" },
    { label: "Spațiu disc", value: "500 MB" },
  ];

  const features = [
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "Desktop Nativ",
      description: "Aplicație desktop optimizată pentru performanță maximă"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Offline Mode",
      description: "Lucrați offline și sincronizați automat când sunteți online"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Securizat",
      description: "Datele dvs. sunt criptate și securizate"
    },
    {
      icon: <FileCode className="h-6 w-6" />,
      title: "API Integration",
      description: "Conectare automată cu Google Ads, Stripe și altele"
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative pt-24 pb-20">
      <AnimatedBackground />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Bookerino Logo" 
              className="w-20 h-20 object-contain drop-shadow-2xl mix-blend-multiply dark:mix-blend-screen rounded-2xl"
              style={{
                imageRendering: '-webkit-optimize-contrast',
                WebkitFontSmoothing: 'antialiased',
                filter: 'contrast(1.1) brightness(1.05)'
              }}
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Bine ai venit, {user?.name || user?.email}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descarcă aplicația Bookerino și începe să gestionezi afacerea ta HoReCa mai eficient
          </p>
        </div>

        {/* Active Subscriptions */}
        {user?.subscriptions && (user?.subscriptions?.professional?.active || user?.subscriptions?.enterprise?.active) && (
          <div className="max-w-5xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Abonamentele Tale Active</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {user?.subscriptions?.professional?.active && (
                <Card className="hover-scale border-primary/50">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900/30">
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {user.subscriptions.professional.plan}
                      </CardTitle>
                      <Badge className="bg-green-500 hover:bg-green-600">Activ</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Preț
                        </span>
                        <span className="font-bold text-lg">{user.subscriptions.professional.price}/{user.subscriptions.professional.billingPeriod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Început
                        </span>
                        <span>{user.subscriptions.professional.startDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Următoarea factură
                        </span>
                        <span>{user.subscriptions.professional.nextBilling}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {user?.subscriptions?.enterprise?.active && (
                <Card className="hover-scale border-primary/50 relative overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900/30">
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {user.subscriptions.enterprise.plan}
                      </CardTitle>
                      <Badge className="bg-green-500 hover:bg-green-600">Activ</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Preț
                        </span>
                        <span className="font-bold text-lg">{user.subscriptions.enterprise.price}/{user.subscriptions.enterprise.billingPeriod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Început
                        </span>
                        <span>{user.subscriptions.enterprise.startDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Următoarea factură
                        </span>
                        <span>{user.subscriptions.enterprise.nextBilling}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Main Download Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="overflow-hidden border-primary shadow-lg-custom">
            <div className="bg-gradient-hero p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Bookerino Download</h2>
                  <p className="text-blue-100 text-lg">
                    Versiunea 2.0.1 • Ultima actualizare: Noiembrie 2025
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <img 
                    src={logo} 
                    alt="Bookerino Logo" 
                    className="h-16 w-16 object-contain mix-blend-screen rounded-xl"
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      WebkitFontSmoothing: 'antialiased',
                      filter: 'contrast(1.1) brightness(1.1)'
                    }}
                  />
                </div>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ce include aplicația:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Management complet al rezervărilor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Rapoarte și analize avansate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Integrare Google Ads API</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Management recenzii clienți</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Sistem de plăți integrat (Stripe)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Cerințe de sistem:</h3>
                  <div className="space-y-3">
                    {systemRequirements.map((req, index) => (
                      <div key={index} className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{req.label}:</span>
                        <span className="text-muted-foreground">{req.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center py-6 border-t">
                <Button 
                  onClick={handleDownload}
                  disabled={downloading}
                  size="lg"
                  className="px-8 py-6 text-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {downloading ? "Se descarcă..." : "Descarcă Bookerino.jar"}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Dimensiune: ~50 MB • Format: JAR (Java Application)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Caracteristici Principale</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-scale cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex rounded-lg bg-primary/10 p-3 mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                Instrucțiuni de Instalare
              </CardTitle>
              <CardDescription>
                Urmează acești pași simpli pentru a instala Bookerino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Instalează Java</p>
                    <p className="text-sm text-muted-foreground">
                      Asigură-te că ai instalat Java Runtime Environment (JRE) 11 sau mai nou.{" "}
                      <a 
                        href="https://www.java.com/download/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Descarcă Java aici
                      </a>
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Descarcă Bookerino.jar</p>
                    <p className="text-sm text-muted-foreground">
                      Apasă butonul de download de mai sus pentru a descărca fișierul aplicației
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Rulează Aplicația</p>
                    <p className="text-sm text-muted-foreground">
                      Dublu-click pe fișierul Bookerino.jar sau rulează din terminal cu:{" "}
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        java -jar Bookerino.jar
                      </code>
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-semibold">Autentifică-te</p>
                    <p className="text-sm text-muted-foreground">
                      Folosește credențialele contului tău Bookerino pentru a te conecta
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="max-w-5xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Ai nevoie de ajutor?</h3>
              <p className="text-muted-foreground mb-6">
                Echipa noastră de suport este aici pentru tine 24/7
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <a href="mailto:ferinogroup@gmail.com">
                    Contactează Suportul
                  </a>
                </Button>
                <AccountSheet>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Setări Cont
                  </Button>
                </AccountSheet>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Deconectare
                </Button>
              </div>
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

export default Dashboard;
