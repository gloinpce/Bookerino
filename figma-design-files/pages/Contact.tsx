import React, { useState, FormEvent } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const Contact = () => {
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

  return (
    <div className="min-h-screen relative pt-24 pb-20">
      <AnimatedBackground />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Contactează-ne
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Ai întrebări? Suntem aici să te ajutăm! Completează formularul sau contactează-ne direct prin email sau telefon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-6">Trimite-ne un Mesaj</h2>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Nume Complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Numele tău"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Mesaj</Label>
                <Textarea
                  id="message"
                  placeholder="Scrie mesajul tău aici..."
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Se trimite..." : "Trimite Mesajul"}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-8 shadow-soft hover:shadow-card transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">contact@bookerino.net</p>
                  <p className="text-muted-foreground">support@bookerino.net</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-soft hover:shadow-card transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                  <p className="text-muted-foreground">+40 123 456 789</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Luni - Vineri: 9:00 - 18:00
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-soft hover:shadow-card transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Adresă</h3>
                  <p className="text-muted-foreground">
                    Str. Exemplu Nr. 123<br />
                    București, România<br />
                    010101
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQ Quick Links */}
            <Card className="p-8 bg-gradient-card">
              <h3 className="font-semibold text-lg mb-3">Întrebări Frecvente</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Înainte de a ne contacta, verifică secțiunea noastră de întrebări frecvente. Poate găsești răspunsul imediat!
              </p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/#faq"}>
                Vezi Întrebări Frecvente
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
