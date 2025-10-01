import { StatCard } from "@/components/stat-card";
import { BookingCard } from "@/components/booking-card";
import { Calendar, DollarSign, Users, Hotel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your hotel overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value="124"
            change="↑ 12%"
            icon={Calendar}
            trend="up"
          />
          <StatCard
            title="Revenue"
            value="$48,250"
            change="↑ 8%"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Occupancy Rate"
            value="78%"
            change="↑ 5%"
            icon={Hotel}
            trend="up"
          />
          <StatCard
            title="Active Guests"
            value="32"
            change="↓ 3%"
            icon={Users}
            trend="down"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {mockBookings.map((booking) => (
                <BookingCard key={booking.id} {...booking} />
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Check-ins</CardTitle>
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
