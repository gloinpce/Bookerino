import React from "react";
import { Card } from "../components/ui/card";
import { Building2, BarChart3, Calendar, BedDouble, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import AnimatedBackground from "../components/AnimatedBackground";
import { ImageWithFallback } from "../components/figma/imageWithFallback";

const Features = () => {
  return (
    <div className="min-h-screen relative pt-24 pb-20">
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Tot Ce Ai Nevoie pentru Afacerea Ta
          </h1>
          <p className="text-xl text-muted-foreground">
            Bookerino oferă aplicația desktop completă cu toate instrumentele necesare pentru gestionarea eficientă a afacerii tale din industria HoReCa
          </p>
        </div>

        {/* Main Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="group p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1761587941453-bd1790225d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGNhbmRsZXN0aWNrc3xlbnwxfHx8fDE3NjM1NDY2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Financial Analysis"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-semibold">
                Analiză Financiară
              </h3>
              <p className="text-muted-foreground">
                Informații financiare în timp real, urmărirea veniturilor și raportare completă pentru a lua decizii bazate pe date pentru afacerea ta.
              </p>
            </div>
          </Card>

          <Card className="group p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYzNTA2MzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Luxury Hotel Room"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-semibold">
                Rezervări Inteligente
              </h3>
              <p className="text-muted-foreground">
                Management eficient al rezervărilor cu confirmări automate, integrare completă Booking.com pentru sincronizare externă și instrumente avansate de gestionare a relațiilor cu clienții.
              </p>
            </div>
          </Card>

          <Card className="group p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758273238370-3bc08e399620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGhvdXNla2VlcGVyJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzYzNTQ2NjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Hotel Housekeeping"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-semibold">
                Management Camere
              </h3>
              <p className="text-muted-foreground">
                Control complet asupra inventarului camerelor, disponibilitate, prețuri și programarea curățeniei într-un singur loc.
              </p>
            </div>
          </Card>

          <Card className="group p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlY2VwdGlvbiUyMGRlc2t8ZW58MXx8fHwxNzYzNTE5MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Hotel Reception"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-semibold">
                Management Oaspeți
              </h3>
              <p className="text-muted-foreground">
                Menține profiluri detaliate ale oaspeților, preferințe și istoric pentru a oferi experiențe personalizate și a construi loialitate.
              </p>
            </div>
          </Card>

          <Card className="group p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1628560946700-dde575386781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aXBsZSUyMGhvdGVscyUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjM1NDY2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Multiple Hotels"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-semibold">
                Suport Multi-Proprietate
              </h3>
              <p className="text-muted-foreground">
                Gestionează multiple locații dintr-un singur tablou de bord cu raportare centralizată și operațiuni simplificate.
              </p>
            </div>
          </Card>

          <Card className="group p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1654277041042-8927699fcfd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBhZHMlMjBsb2dvfGVufDF8fHx8MTc2MzU0NjYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Google Ads"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
              <h3 className="mb-3 text-2xl font-semibold">
                Integrare Google Ads & Recenzii
              </h3>
              <p className="text-muted-foreground">
                Monitorizează campaniile Google Ads, gestionează recenziile clienților și optimizează prezența online pentru creșterea afacerii tale.
              </p>
            </div>
          </Card>
        </div>

        {/* What's Included */}
        <Card className="p-8 bg-gradient-card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Ce Include Aplicația</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Aplicație desktop completă pentru managementul afacerii</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Sistem de rezervări automat cu notificări</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Rapoarte financiare în timp real</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Integrare Google Ads pentru marketing</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">API Booking.com pentru sincronizare externă</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Management recenzii și reputație online</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Suport tehnic dedicat prin email</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Actualizări gratuite pentru viață</span>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Pregătit Să Începi?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Alătură-te miilor de afaceri care și-au simplificat operațiunile cu Bookerino
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/auth">Începe Perioada de Probă Gratuită</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">Vezi Prețurile</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;