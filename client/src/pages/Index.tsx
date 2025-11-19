import React, { useState, FormEvent } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Building2, BarChart3, Calendar, BedDouble, Users, TrendingUp, Mail, Phone, MapPin, Send, CheckCircle, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
// @ts-ignore - Figma asset imports
const logo = "/logo.png";
const backgroundImage = "/attached_assets/analiza%20performanta%20ss.png"; // Background image
import { ImageWithFallback } from "../components/figma/imageWithFallback";

const Index = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert("Mesaj trimis! Vă vom contacta în cel mai scurt timp.");
      setContactForm({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const faqs = [
    {
      question: "Cum funcționează perioada de probă gratuită?",
      answer: "Perioada de probă gratuită durează 7 zile și vă oferă acces complet la toate funcționalitățile Bookerino. Nu este necesară nici-un card de credit pentru a începe. Puteți anula oricând în timpul perioadei de probă fără nicio obligație."
    },
    {
      question: "Ce tipuri de afaceri pot folosi Bookerino?",
      answer: "Bookerino este perfect pentru hoteluri, pensiuni, taverne și orice alt tip de afacere din industria HoReCa. Sistemul este flexibil și se adaptează nevoilor specifice ale fiecărei afaceri."
    },
    {
      question: "Pot integra Bookerino cu alte sisteme?",
      answer: "Da! Bookerino oferă integrare completă cu Booking.com prin API, integrare Google Ads și alte instrumente de management profesionale. Aplicația necesită conexiune la internet pentru a funcționa optim cu toate integrările API și pentru sincronizarea datelor în timp real."
    },
    {
      question: "Ce se întâmplă cu datele mele?",
      answer: "Datele dvs. sunt stocate în siguranță și sunt criptate. Respectăm GDPR și nu partajăm niciodată informațiile dvs. cu terți. Aveți control complet asupra datelor și le puteți exporta oricând."
    },
    {
      question: "Oferiți suport tehnic?",
      answer: "Da! Oferim suport pentru planul Professional și suport dedicat 24/7 pentru planul Enterprise. De asemenea, oferim training și documentație completă."
    },
    {
      question: "Aplicația funcționează offline?",
      answer: "Bookerino necesită conexiune la internet pentru a funcționa optim, deoarece utilizează integrări cu Booking.com, Google Ads și sincronizarea datelor în timp real. Conexiunea la internet asigură accesul la toate funcționalitățile și integrările platformei."
    }
  ];

  return (
    <div className="min-h-screen relative pt-16">
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero z-10">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={backgroundImage} 
            alt="Bookerino Background" 
            className="w-full h-full object-cover opacity-10 mix-blend-overlay dark:opacity-5"
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 sm:py-32 relative z-10">
          <div className="animate-fade-in text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={logo} 
                alt="Bookerino Logo" 
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl mix-blend-lighten dark:mix-blend-screen rounded-2xl"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  WebkitFontSmoothing: 'antialiased',
                  filter: 'contrast(1.1) brightness(1.05)'
                }}
              />
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground dark:text-white sm:text-6xl lg:text-7xl">
              Bookerino
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-foreground dark:text-white">
              Transformă-ți afacerea din industria ospitalității cu aplicația desktop profesională care oferă 
              analiză financiară, management camere, rezervări, integrare Booking.com, management recenzii și integrare Google Ads.
              <br />
              <span className="font-semibold mt-2 block">Aplicație desktop completă cu integrări API pentru funcționalitate optimă și conexiune permanentă.</span>
            </p>
            <div className="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row">
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-foreground dark:border-white text-foreground dark:text-white hover:bg-foreground/10 dark:hover:bg-white/10 transition-all hover:scale-105 w-full sm:w-auto"
              >
                <Link to="/features">Descoperă Funcționalitățile</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-card transition-all hover:scale-105 w-full sm:w-auto"
              >
                <Link to="/auth">Începe Perioada de Probă Gratuită</Link>
              </Button>
            </div>
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-foreground dark:text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">7 zile probă gratuită</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">Setup în 5 minute</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Date securizate GDPR</span>
              </div>
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
      <section id="features" className="container mx-auto px-4 py-20 scroll-mt-16 relative z-10">
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
          <Card className="group animate-fade-in shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden rounded-2xl h-[200px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1761587941453-bd1790225d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGNhbmRsZXN0aWNrc3xlbnwxfHx8fDE3NjM1NDY2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Financial Analysis"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-start">
              <h3 className="mb-2 text-xl font-bold">
                Analiză Financiară
              </h3>
              <p className="text-sm text-muted-foreground">
                Informații financiare în timp real, urmărirea veniturilor și raportare completă pentru a lua decizii bazate pe date pentru afacerea ta.
              </p>
            </div>
          </Card>

          <Card className="group animate-fade-in shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden rounded-2xl h-[200px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYzNTA2MzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Smart Reservations"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-start">
              <h3 className="mb-2 text-xl font-bold">
                Rezervări Inteligente
              </h3>
              <p className="text-sm text-muted-foreground">
                Management eficient al rezervărilor cu confirmări automate, integrare completă Booking.com pentru sincronizare externă și instrumente avansate de gestionare a relațiilor cu clienții.
              </p>
            </div>
          </Card>

          <Card className="group animate-fade-in shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden rounded-2xl h-[200px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758273238370-3bc08e399620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGhvdXNla2VlcGVyJTIwY2xlYW5pbmd8ZW58MXx8fHwxNzYzNTQ2NjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Room Management"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-start">
              <h3 className="mb-2 text-xl font-bold">
                Management Camere
              </h3>
              <p className="text-sm text-muted-foreground">
                Control complet asupra inventarului camerelor, disponibilitate, prețuri și programarea curățeniei într-un singur loc.
              </p>
            </div>
          </Card>

          <Card className="group animate-fade-in shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden rounded-2xl h-[200px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlY2VwdGlvbiUyMGRlc2t8ZW58MXx8fHwxNjM1MTkyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Guest Management"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-start">
              <h3 className="mb-2 text-xl font-bold">
                Management Oaspeți
              </h3>
              <p className="text-sm text-muted-foreground">
                Menține profiluri detaliate ale oaspeților, preferințe și istoric pentru a oferi experiențe personalizate și a construi loialitate.
              </p>
            </div>
          </Card>

          <Card className="group animate-fade-in shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden rounded-2xl h-[200px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1628560946700-dde575386781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aXBsZSUyMGhvdGVscyUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NjM1NDY2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Multi-Property Support"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-start">
              <h3 className="mb-2 text-xl font-bold">
                Suport Multi-Proprietate
              </h3>
              <p className="text-sm text-muted-foreground">
                Gestionează multiple locații dintr-un singur tablou de bord cu raportare centralizată și operațiuni simplificate.
              </p>
            </div>
          </Card>

          <Card className="group animate-fade-in shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer relative overflow-hidden rounded-2xl h-[200px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1654277041042-8927699fcfd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBhZHMlMjBsb2dvfGVufDF8fHx8MTc2MzU0NjYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Google Ads Integration"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 p-6 h-full flex flex-col justify-start">
              <h3 className="mb-2 text-xl font-bold">
                Integrare Google Ads & Recenzii
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitorizează campaniile Google Ads, gestionează recenziile clienților și optimizează prezența online pentru creșterea afacerii tale.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold !text-black">
            Cum Funcționează Bookerino
          </h2>
          <p className="mx-auto max-w-2xl text-lg !text-black">
            Începe să folosești Bookerino în doar câțiva pași simpli
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 !text-black">Înregistrare Rapidă</h3>
              <p className="!text-black">
                Creează contul tău în mai puțin de 2 minute. Fără card de credit necesar pentru perioada de probă.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 !text-black">Configurare Simplă</h3>
              <p className="!text-black">
                Descarcă aplicația, adaugă camerele și setează prețurile. Sistemul te ghidează pas cu pas.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 !text-black">Gestionează & Crește</h3>
              <p className="!text-black">
                Primești rezervări, monitorizezi analize, gestionezi recenzii și optimizezi afacerea ta.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Card className="p-6 bg-gradient-card">
              <h4 className="text-xl font-semibold mb-3 !text-black">Ce Primești Începând de Astăzi:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">Aplicație desktop completă pentru managementul afacerii</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">Sistem de rezervări automat cu notificări</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">Rapoarte financiare în timp real</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">Integrare Google Ads pentru marketing</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">API Booking.com pentru sincronizare externă</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">Management recenzii și reputație online</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm !text-black">Suport tehnic dedicat prin email</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Prețuri Simple și Transparente
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Alege planul potrivit pentru afacerea ta. Toate planurile includ perioadă de probă gratuită.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-8 shadow-soft hover:shadow-card transition-all hover-scale">
            <h3 className="text-2xl font-bold mb-2">Bookerino Professional</h3>
            <p className="text-muted-foreground mb-4">Perfect pentru hoteluri și pensiuni</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">€45</span>
              <span className="text-muted-foreground">/lună</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Până la 50 camere</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Toate funcționalitățile</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Integrări Google Ads & Booking.com</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Suport prioritar</span>
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/auth">Începe Perioada de Probă</Link>
            </Button>
          </Card>

          <Card className="p-8 shadow-soft hover:shadow-card transition-all border-primary hover-scale">
            <div className="mb-2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                CEL MAI BUN PREȚ
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Bookerino Enterprise</h3>
            <p className="text-muted-foreground mb-4">Cel mai bun preț pentru hoteluri mari</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">€450</span>
              <span className="text-muted-foreground">/an</span>
              <p className="text-sm text-green-600 font-semibold mt-1">Doar €37.50/lună</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Camere nelimitate</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Toate funcționalitățile Premium</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Suport dedicat 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Account manager personal</span>
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/auth">Începe Perioada de Probă</Link>
            </Button>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Link to="/pricing" className="text-primary hover:underline font-semibold">
            Vezi toate planurile și detaliile →
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Întrebări Frecvente
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Găsește răspunsuri la cele mai comune întrebări despre Bookerino.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              Contactează-ne
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Ai întrebări? Suntem aici să te ajutăm. Trimite-ne un mesaj și îți vom răspunde în cel mai scurt timp.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Informații de Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:ferinogroup@gmail.com" className="text-primary hover:underline">
                      ferinogroup@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <a href="tel:+40123456789" className="text-primary hover:underline">
                      +40 123 456 789
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Adresă</p>
                    <p className="text-muted-foreground">București, România</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Trimite un Mesaj</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Nume</Label>
                  <Input
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    placeholder="Numele tău"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    placeholder="email@exemplu.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-message">Mesaj</Label>
                  <Textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    placeholder="Mesajul tău..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Se trimite...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Trimite Mesaj
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Gata să-ți Transformi Afacerea?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground">
            Alătură-te altor afaceri din industria ospitalității care folosesc Bookerino 
            pentru a-și simplifica operațiunile și a-și crește veniturile.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Link to="/pricing">Vezi Prețurile</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Link to="/auth">Începe Astăzi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Bookerino</h3>
              <p className="text-sm text-white">
                Aplicație desktop profesională pentru management HoReCa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Produs</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Prețuri</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Funcții</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Începe Probă</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Companie</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Politica de Confidențialitate</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Termeni și Condiții</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Suport</h4>
              <ul className="space-y-2 text-white">
                <li><Link to="/contact" className="hover:text-primary transition-colors">Ajutor</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
            <p>© 2025 Bookerino. Toate drepturile rezervate.</p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
