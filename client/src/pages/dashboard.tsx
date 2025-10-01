import { StatCard } from "@/components/stat-card";
import { BookingCard } from "@/components/booking-card";
import { Calendar, DollarSign, Users, Hotel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Dashboard() {
  const mockBookings = [
    {
      id: "1",
      guestName: "Sarah Johnson",
      guestEmail: "sarah.j@email.com",
      roomName: "Deluxe Suite 301",
      checkIn: new Date("2024-10-15"),
      checkOut: new Date("2024-10-18"),
      status: "confirmed" as const,
      totalPrice: "450.00",
    },
    {
      id: "2",
      guestName: "Michael Chen",
      guestEmail: "m.chen@email.com",
      roomName: "Standard Room 205",
      checkIn: new Date("2024-10-16"),
      checkOut: new Date("2024-10-20"),
      status: "pending" as const,
      totalPrice: "320.00",
    },
    {
      id: "3",
      guestName: "Emma Williams",
      guestEmail: "emma.w@email.com",
      roomName: "Premium Suite 402",
      checkIn: new Date("2024-10-14"),
      checkOut: new Date("2024-10-17"),
      status: "checked-in" as const,
      totalPrice: "680.00",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Panou de Control</h1>
          <p className="text-muted-foreground">Bine ai venit la sistemul de management hotelier</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Rezervări"
            value="248"
            description="+12% față de luna trecută"
            icon={Calendar}
            testId="stat-bookings"
          />
          <StatCard
            title="Camere Disponibile"
            value="32"
            description="Din 50 camere totale"
            icon={Hotel}
            testId="stat-rooms"
          />
          <StatCard
            title="Venit"
            value="$12,450"
            description="+8% față de luna trecută"
            icon={DollarSign}
            testId="stat-revenue"
          />
          <StatCard
            title="Rating Mediu"
            value="4.8"
            description="Pe baza a 156 recenzii"
            icon={Star}
            testId="stat-rating"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rezervări Recente</CardTitle>
                <CardDescription>Ultimele tale rezervări</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBookings.map((booking) => (
                  <BookingCard key={booking.id} {...booking} />
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recenzii Recente</CardTitle>
              <CardDescription>Ultimele feedback-uri de la oaspeți</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b" data-testid="checkin-sarah">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Suite 301</p>
                </div>
                <p className="text-sm text-muted-foreground">Oct 15</p>
              </div>
              <div className="flex items-center justify-between pb-3 border-b" data-testid="checkin-michael">
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Room 205</p>
                </div>
                <p className="text-sm text-muted-foreground">Oct 16</p>
              </div>
              <div className="flex items-center justify-between" data-testid="checkin-david">
                <div>
                  <p className="font-medium">David Kim</p>
                  <p className="text-sm text-muted-foreground">Suite 402</p>
                </div>
                <p className="text-sm text-muted-foreground">Oct 17</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}