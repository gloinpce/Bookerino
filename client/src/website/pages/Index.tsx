import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, BarChart3, Calendar, BedDouble, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { SplitText } from "@/components/split-text";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 sm:py-32">
          <div className="animate-fade-in text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
              <SplitText
                text="Bookerino"
                delay={100}
                duration={0.6}
              />
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/90 sm:text-2xl">
              Soluție Completă de Management HoReCa
            </p>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-primary-foreground/80">
              Simplifică-ți afacerea din industria ospitalității cu instrumente puternice pentru 
              analiză financiară, managementul camerelor, rezervări și multe altele.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                asChild 
                size="lg" 
                className="bg-background text-primary hover:bg-background/90 shadow-card"
              >
                <Link to="/auth">Începe Perioada de Probă</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Link to="/pricing">Vezi Prețurile</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="hsl(var(--background))"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Tot ce Ai Nevoie pentru a-ți Gestiona Afacerea
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Bookerino oferă instrumente complete concepute special pentru hoteluri, 
            restaurante și afaceri din industria ospitalității.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3">
              <BarChart3 className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-card-foreground">
              Analiză Financiară
            </h3>
            <p className="text-muted-foreground">
              Informații financiare în timp real, urmărirea veniturilor și raportare completă 
              pentru a lua decizii bazate pe date pentru afacerea ta.
            </p>
          </Card>

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3">
              <Calendar className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-card-foreground">
              Rezervări Inteligente
            </h3>
            <p className="text-muted-foreground">
              Management eficient al rezervărilor cu confirmări automate, integrare calendar 
              și instrumente de gestionare a relațiilor cu clienții.
            </p>
          </Card>

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3">
              <BedDouble className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-card-foreground">
              Managementul Camerelor
            </h3>
            <p className="text-muted-foreground">
              Control complet asupra inventarului camerelor, disponibilitate, prețuri și 
              programarea curățeniei într-un singur loc.
            </p>
          </Card>

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3">
              <Users className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-card-foreground">
              Managementul Oaspeților
            </h3>
            <p className="text-muted-foreground">
              Menține profiluri detaliate ale oaspeților, preferințe și istoric pentru a oferi 
              experiențe personalizate și a construi loialitate.
            </p>
          </Card>

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3">
              <Building2 className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-card-foreground">
              Suport Multi-Proprietate
            </h3>
            <p className="text-muted-foreground">
              Gestionează multiple locații dintr-un singur tablou de bord cu raportare centralizată 
              și operațiuni simplificate.
            </p>
          </Card>

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3">
              <TrendingUp className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-card-foreground">
              Analiza Performanței
            </h3>
            <p className="text-muted-foreground">
              Urmărește indicatori cheie, rate de ocupare, venit per cameră disponibilă (RevPAR) 
              și identifică oportunități de creștere.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-hero p-12 text-center shadow-card">
          <h2 className="mb-4 text-4xl font-bold text-primary-foreground">
            Gata să-ți Transformi Afacerea?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Alătură-te altor afaceri din industria ospitalității care folosesc Bookerino 
            pentru a-și simplifica operațiunile și a-și crește veniturile.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-background text-primary hover:bg-background/90 shadow-card"
          >
            <Link to="/auth">Începe Astăzi</Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Bookerino. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

