import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const Pricing = () => {
  const plans = [
    {
      name: "Bookerino Professional",
      price: "45",
      period: "€/lună",
      description: "Pentru afaceri în creștere",
      features: [
        "Până la 50 camere",
        "Aplicație desktop completă",
        "Suport prioritar",
        "Rapoarte avansate",
        "Integrare Booking.com",
        "Integrare Google Ads",
        "Management recenzii"
      ],
      popular: true
    },
    {
      name: "Bookerino Enterprise",
      price: "450",
      period: "€/an",
      description: "Pentru hoteluri mari",
      savings: "Doar €37.50/lună",
      features: [
        "Camere nelimitate",
        "Aplicație desktop completă",
        "Suport dedicat 24/7",
        "Rapoarte personalizate",
        "API Booking.com avansat",
        "Training inclus",
        "Account manager dedicat",
        "Economie semnificativă"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative pt-24 pb-20">
      <AnimatedBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Prețuri Simple și Transparente</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alege planul perfect pentru afacerea ta. Toate planurile includ aplicația desktop și perioadă de probă gratuită de 7 zile.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative hover-scale ${plan.popular ? "border-primary shadow-lg-custom" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    CEL MAI POPULAR
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="text-green-600 font-semibold mt-2">{plan.savings}</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/auth">Începe acum</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-primary/5">
            <h3 className="text-2xl font-bold mb-4 text-center">Întrebări despre prețuri?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Ce include perioada de probă?</h4>
                <p className="text-muted-foreground">
                  Perioada de probă de 7 zile îți oferă acces complet la toate funcționalitățile planului ales, fără a fi nevoie de card.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pot schimba planul oricând?</h4>
                <p className="text-muted-foreground">
                  Da, poți face upgrade sau downgrade oricând. Diferența de preț va fi calculată proporțional.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ce metode de plată acceptați?</h4>
                <p className="text-muted-foreground">
                  Acceptăm toate cardurile majore: Visa, Mastercard, American Express. Plata este securizată și procesată în mod sigur.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Oferiți reduceri pentru plata anuală?</h4>
                <p className="text-muted-foreground">
                  Da! Planul Enterprise anual costă mai puțin de €40 pe lună, comparativ cu €45/lună la planul lunar.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="text-muted-foreground hover:underline">
            ← Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

