import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url("attached_assets/header site_1759436834395.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <header className="border-b relative z-10">
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

      <main className="flex-1 relative z-10">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Automatizează Managementul Hotelului
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Eficientizează rezervările, gestionează recenziile și urmărește analitice într-o singură platformă puternică. Construit pentru hotelierii moderni.
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-get-started">
            Începe Acum
          </Button>
        </section>

        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Tot ce ai nevoie pentru a-ți conduce hotelul
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Gestionarea Rezervărilor</h3>
                  <p className="text-muted-foreground">
                    Urmărește și gestionează toate rezervările într-un singur loc cu actualizări în timp real.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Gestionarea Recenziilor</h3>
                  <p className="text-muted-foreground">
                    Monitorizează și răspunde la recenziile oaspeților pentru a-ți menține reputația.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <img
                      src="attached_assets/logo bokkerino_1759435973381.png"
                      alt="Bookerino Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Inventarul Camerelor</h3>
                  <p className="text-muted-foreground">
                    Ține evidența disponibilității camerelor, prețurilor și programului de întreținere.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Panou de Analiză</h3>
                  <p className="text-muted-foreground">
                    Ia decizii bazate pe date cu analize și rapoarte complete.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Automatizare</h3>
                  <p className="text-muted-foreground">
                    Automatizează sarcinile repetitive și concentrează-te pe oferirea de experiențe excelente oaspeților.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Sigur și Fiabil</h3>
                  <p className="text-muted-foreground">
                    Datele tale sunt protejate cu măsuri de securitate de nivel enterprise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Gata să îți transformi operațiunile hotelului?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Alătură-te miilor de hotelieri care folosesc deja BOOKERINO
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-start-free">
            Începe Perioada Gratuită
          </Button>
        </section>
      </main>

      <footer className="border-t relative z-10">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 BOOKERINO. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}