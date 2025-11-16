/**
 * NOTE: This is a reference file for Figma design purposes.
 * These files are copies of the actual source code and are not meant to compile.
 * TypeScript errors are expected as dependencies are not available in this folder.
 * For the actual working code, see: client/src/website/pages/Pricing.tsx
 */

import React from "react";
// @ts-ignore - Reference file, dependencies not available
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// @ts-ignore - Reference file, dependencies not available
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "0",
      period: "lei/lună",
      description: "Perfect pentru început",
      features: [
        "Până la 10 camere",
        "Rezervări de bază",
        "Suport email",
        "Rapoarte de bază"
      ]
    },
    {
      name: "Professional",
      price: "299",
      period: "lei/lună",
      description: "Pentru afaceri în creștere",
      features: [
        "Până la 50 camere",
        "Toate funcțiile",
        "Suport priorititar",
        "Rapoarte avansate",
        "Integrări API"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "599",
      period: "lei/lună",
      description: "Pentru hoteluri mari",
      features: [
        "Camere nelimitate",
        "Toate funcțiile",
        "Suport dedicat 24/7",
        "Rapoarte personalizate",
        "Integrări personalizate",
        "Training inclus"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Prețuri</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alege planul perfect pentru afacerea ta
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={plan.popular ? "border-primary shadow-lg scale-105" : ""}
            >
              <CardHeader>
                {plan.popular && (
                  <div className="text-xs font-semibold text-primary mb-2">
                    POPULAR
                  </div>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </div>
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

