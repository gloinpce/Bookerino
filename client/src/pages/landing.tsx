import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel, Calendar, Star, BarChart3, Shield, Zap } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Hotel className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">HotelHub</span>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Log In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Automate Your Hotel Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline bookings, manage reviews, and track analytics all in one powerful platform. Built for modern hoteliers.
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-get-started">
            Get Started
          </Button>
        </section>

        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need to run your hotel
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Booking Management</h3>
                  <p className="text-muted-foreground">
                    Track and manage all your reservations in one place with real-time updates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Review Management</h3>
                  <p className="text-muted-foreground">
                    Monitor and respond to guest reviews to maintain your reputation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <Hotel className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Room Inventory</h3>
                  <p className="text-muted-foreground">
                    Keep track of room availability, pricing, and maintenance schedules.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Make data-driven decisions with comprehensive insights and reports.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Automation</h3>
                  <p className="text-muted-foreground">
                    Automate repetitive tasks and focus on delivering great guest experiences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                  <p className="text-muted-foreground">
                    Your data is protected with enterprise-grade security measures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your hotel operations?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of hoteliers already using HotelHub
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-start-free">
            Start Free Trial
          </Button>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 HotelHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
