import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, BarChart3, Calendar, BedDouble, Users, TrendingUp, Star, Mail, Phone, MapPin, CheckCircle2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { SplitText } from "@/components/split-text";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mesaj trimis!",
        description: "Vă vom contacta în cel mai scurt timp.",
      });
      setContactForm({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const testimonials = [
    {
      name: "Maria Popescu",
      role: "Manager Hotel",
      company: "Hotel Central",
      content: "Bookerino ne-a transformat modul în care gestionăm rezervările. Eficiența a crescut cu 40%!",
      rating: 5
    },
    {
      name: "Ion Georgescu",
      role: "Proprietar",
      company: "Restaurant La Munte",
      content: "Rapoartele financiare sunt exact ce aveam nevoie. Recomand cu încredere!",
      rating: 5
    },
    {
      name: "Ana Ionescu",
      role: "Director Operațiuni",
      company: "Hotel Group",
      content: "Interfața este intuitivă și suportul este excelent. Best investment ever!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Cum funcționează perioada de probă gratuită?",
      answer: "Perioada de probă gratuită durează 7 zile și vă oferă acces complet la toate funcționalitățile Bookerino. Nu este necesară nicio card de credit pentru a începe. Puteți anula oricând în timpul perioadei de probă fără nicio obligație."
    },
    {
      question: "Ce tipuri de afaceri pot folosi Bookerino?",
      answer: "Bookerino este perfect pentru hoteluri, pensiuni, restaurante, baruri și orice alt tip de afacere din industria HoReCa. Sistemul este flexibil și se adaptează nevoilor specifice ale fiecărei afaceri."
    },
    {
      question: "Pot integra Bookerino cu alte sisteme?",
      answer: "Da! Bookerino oferă API-uri complete pentru integrare cu sisteme de plată, sisteme de contabilitate și alte instrumente de management. Planurile Professional și Enterprise includ suport pentru integrări personalizate."
    },
    {
      question: "Ce se întâmplă cu datele mele?",
      answer: "Datele dvs. sunt stocate în siguranță și sunt criptate. Respectăm GDPR și nu partajăm niciodată informațiile dvs. cu terți. Aveți control complet asupra datelor și le puteți exporta oricând."
    },
    {
      question: "Oferiți suport tehnic?",
      answer: "Da! Oferim suport email pentru toate planurile, suport priorititar pentru planul Professional și suport dedicat 24/7 pentru planul Enterprise. De asemenea, oferim training și documentație completă."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pt-16">
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
                className="bg-background text-primary hover:bg-background/90 shadow-card transition-all hover:scale-105"
              >
                <Link to="/auth">Începe Perioada de Probă</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-all hover:scale-105"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <a href="#features">Află Mai Multe</a>
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
      <section id="features" className="container mx-auto px-4 py-20 scroll-mt-16">
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
          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 transition-transform group-hover:scale-110">
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

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 transition-transform group-hover:scale-110">
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

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 transition-transform group-hover:scale-110">
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

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 transition-transform group-hover:scale-110">
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

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 transition-transform group-hover:scale-110">
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

          <Card className="group animate-fade-in p-8 shadow-soft transition-all hover:shadow-card hover:scale-105 cursor-pointer">
            <div className="mb-4 inline-flex rounded-lg bg-accent p-3 transition-transform group-hover:scale-110">
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

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Ce Spun Clienții Noștri
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Mii de afaceri din industria HoReCa au ales Bookerino pentru a-și simplifica operațiunile.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 shadow-soft hover:shadow-card transition-all hover:scale-105">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
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
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
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
                  <div className="rounded-lg bg-accent p-3">
                    <Mail className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:contact@bookerino.net" className="text-primary hover:underline">
                      contact@bookerino.net
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent p-3">
                    <Phone className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <a href="tel:+40123456789" className="text-primary hover:underline">
                      +40 123 456 789
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-accent p-3">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
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
        <Card className="bg-gradient-hero p-12 text-center shadow-card">
          <h2 className="mb-4 text-4xl font-bold text-primary-foreground">
            Gata să-ți Transformi Afacerea?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Alătură-te altor afaceri din industria ospitalității care folosesc Bookerino 
            pentru a-și simplifica operațiunile și a-și crește veniturile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 shadow-card transition-all hover:scale-105"
            >
              <Link to="/auth">Începe Astăzi</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-all hover:scale-105"
            >
              <Link to="/pricing">Vezi Prețurile</Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Bookerino</h3>
              <p className="text-sm text-muted-foreground">
                Soluție completă de management HoReCa pentru afaceri moderne.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Prețuri</Link></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Funcții</a></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Începe Probă</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Companie</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#contact" className="hover:text-primary transition-colors">Despre Noi</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Cariere</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suport</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#contact" className="hover:text-primary transition-colors">Documentație</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Ajutor</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Bookerino. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
