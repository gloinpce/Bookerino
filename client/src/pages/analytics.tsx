import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      // Add any other needed HTML tags here, or use [elemName: string]: any; as a fallback:
      [elemName: string]: any;
    }
  }
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { useBookings } from "@/hooks/useBookings";
import { type Booking } from "@shared/schema";

export default function Analytics() {
  // Remove all random/static data injection
  
  // Example: Get booking data and process for revenue and occupancy
  const { bookings } = useBookings(); // This would be populated by automation

  // Process bookings for revenue per month and occupancy per month dynamically
  const months = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun"];
  function getMonth(date: Date): string {
    const monthIndex = date.getMonth();
    return months[monthIndex] || "";
  }

  // Revenue per month (based on checkIn date)
  const revenueData = months.map((monthName) => ({
    month: monthName,
    revenue: bookings
      ? bookings
          .filter((b: Booking) => getMonth(new Date(b.checkIn)) === monthName)
          .reduce((sum: number, b: Booking) => {
            const price = parseFloat(b.totalPrice || "0");
            return sum + (Number.isFinite(price) ? price : 0);
          }, 0)
      : 0
  }));

  // Occupancy per month (percentage of booked rooms)
  const roomsCount = 100; // or derive dynamically if available
  const occupancyData = months.map((monthName) => {
    const bookingsInMonth = bookings
      ? bookings.filter((b: Booking) => getMonth(new Date(b.checkIn)) === monthName)
      : [];
    // Calculate total room-nights for the month
    const totalRoomNights = bookingsInMonth.reduce((sum: number, b: Booking) => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + Math.max(0, nights);
    }, 0);
    const daysInMonth = 30; // Ideally, use moment.js or date-fns to get the real number of days
    const occupancyRate = roomsCount ? (totalRoomNights / (roomsCount * daysInMonth)) * 100 : 0;
    return {
      month: monthName,
      rate: occupancyRate,
    };
  });

  // Booking sources
  const bookingSources = [
    "direct",
    "booking.com",
    "expedia",
    "airbnb",
  ];
  const bookingSourcesData = bookingSources.map((source) => ({
    source: source.charAt(0).toUpperCase() + source.slice(1),
    bookings: bookings
      ? bookings.filter((b: Booking) => b.source?.toLowerCase() === source.toLowerCase()).length
      : 0
  }));

  return (
    <div className="flex-1 overflow-auto" data-scroll-container>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Analize</h1>
            <p className="text-muted-foreground">Urmărește performanța și informațiile hotelului tău</p>
          </div>
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Ultima Lună</SelectItem>
              <SelectItem value="3months">Ultimele 3 Luni</SelectItem>
              <SelectItem value="6months">Ultimele 6 Luni</SelectItem>
              <SelectItem value="1year">Ultimul An</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tendința Veniturilor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rata de Ocupare</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Surse de Rezervare</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingSourcesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="bookings" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}