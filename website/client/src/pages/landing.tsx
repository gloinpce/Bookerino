import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b relative z-10 bg-card-gradient backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="attached_assets/logo bokkerino_1759435973381.png"
              alt="Bookerino Logo"
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="text-xl font-bold">BOOKERINO</span>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Autentificare
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
          <div className="container mx-auto px-4 py-32 text-center relative z-10">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary animate-gradient">
              Automatizează Managementul Hotelului
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Eficientizează rezervările, gestionează recenziile și urmărește analitice într-o singură platformă puternică. Construit pentru hotelierii moderni.
            </p>
            <Button 
              size="lg" 
              onClick={handleLogin} 
              data-testid="button-get-started"
              className="bg-primary-gradient hover:opacity-90 transition-opacity text-primary-foreground shadow-lg hover:shadow-xl"
            >
              Începe Acum
            </Button>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              Tot ce ai nevoie pentru a-ți conduce hotelul
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              O platformă completă pentru gestionarea modernă a hotelurilor
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-gradient mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Gestionarea Rezervărilor</h3>
                  <p className="text-muted-foreground">
                    Urmărește și gestionează toate rezervările într-un singur loc cu actualizări în timp real.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-gradient mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Gestionarea Recenziilor</h3>
                  <p className="text-muted-foreground">
                    Monitorizează și răspunde la recenziile oaspeților pentru a-ți menține reputația.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src="attached_assets/logo bokkerino_1759435973381.png"
                      alt="Bookerino Logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Inventarul Camerelor</h3>
                  <p className="text-muted-foreground">
                    Ține evidența disponibilității camerelor, prețurilor și programului de întreținere.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-gradient mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Panou de Analiză</h3>
                  <p className="text-muted-foreground">
                    Ia decizii bazate pe date cu analize și rapoarte complete.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-gradient mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">4</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Automatizare</h3>
                  <p className="text-muted-foreground">
                    Automatizează sarcinile repetitive și concentrează-te pe oferirea de experiențe excelente oaspeților.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-gradient mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">5</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sigur și Fiabil</h3>
                  <p className="text-muted-foreground">
                    Datele tale sunt protejate cu măsuri de securitate de nivel enterprise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-primary-gradient opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Gata să îți transformi operațiunile hotelului?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Alătură-te miilor de hotelieri care folosesc deja BOOKERINO pentru a-și automatiza și optimiza operațiunile hoteliere
            </p>
            <Button 
              size="lg" 
              onClick={handleLogin} 
              data-testid="button-start-free"
              className="bg-primary-gradient hover:opacity-90 transition-opacity text-primary-foreground shadow-lg hover:shadow-xl"
            >
              Începe Perioada Gratuită
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t relative z-10 bg-card-gradient backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 BOOKERINO. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}
