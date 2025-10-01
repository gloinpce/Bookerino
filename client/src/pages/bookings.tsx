import { BookingCard } from "@/components/booking-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Bookings() {
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
    {
      id: "4",
      guestName: "James Brown",
      guestEmail: "j.brown@email.com",
      roomName: "Standard Room 108",
      checkIn: new Date("2024-10-12"),
      checkOut: new Date("2024-10-15"),
      status: "checked-out" as const,
      totalPrice: "240.00",
    },
    {
      id: "5",
      guestName: "Lisa Anderson",
      guestEmail: "lisa.a@email.com",
      roomName: "Deluxe Suite 305",
      checkIn: new Date("2024-10-20"),
      checkOut: new Date("2024-10-23"),
      status: "confirmed" as const,
      totalPrice: "540.00",
    },
    {
      id: "6",
      guestName: "Robert Taylor",
      guestEmail: "r.taylor@email.com",
      roomName: "Premium Suite 501",
      checkIn: new Date("2024-10-18"),
      checkOut: new Date("2024-10-21"),
      status: "pending" as const,
      totalPrice: "720.00",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground">Manage all your hotel reservations</p>
          </div>
          <Button data-testid="button-new-booking">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-9"
              data-testid="input-search-bookings"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-more-filters">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockBookings.map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}
        </div>
      </div>
    </div>
  );
}
