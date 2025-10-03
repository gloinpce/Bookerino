import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Booking, type Room } from "@shared/schema";
import { BookingCard } from "@/components/booking-card";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Bookings() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Succes",
        description: "Rezervarea a fost ștearsă cu succes",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge rezervarea",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sigur vrei să ștergi această rezervare?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingBooking(undefined);
    setDialogOpen(true);
  };

  const getRoomName = (roomId: string) => {
    return rooms?.find((r) => r.id === roomId)?.name || "Camera necunoscută";
  };

  const filteredBookings = bookings?.filter((booking) => {
    const roomName = getRoomName(booking.roomId);
    const matchesSearch =
      searchQuery === "" ||
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roomName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-auto" data-scroll-container>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Rezervări</h1>
            <p className="text-muted-foreground">Gestionează rezervările hotelului tău</p>
          </div>
          <Button onClick={handleAddNew} data-testid="button-new-booking">
            <Plus className="h-4 w-4 mr-2" />
            Rezervare Nouă
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută rezervări..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-bookings"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
              <SelectValue placeholder="Filtrare status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Statusurile</SelectItem>
              <SelectItem value="pending">În Așteptare</SelectItem>
              <SelectItem value="confirmed">Confirmată</SelectItem>
              <SelectItem value="checked-in">Check-in Efectuat</SelectItem>
              <SelectItem value="checked-out">Check-out Efectuat</SelectItem>
              <SelectItem value="cancelled">Anulată</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {bookingsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[150px] rounded-lg" data-testid={`skeleton-booking-${i}`} />
            ))}
          </div>
        ) : filteredBookings && filteredBookings.length > 0 ? (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                guestName={booking.guestName}
                guestEmail={booking.guestEmail}
                roomName={getRoomName(booking.roomId)}
                checkIn={new Date(booking.checkIn)}
                checkOut={new Date(booking.checkOut)}
                status={booking.status as "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled"}
                totalPrice={booking.totalPrice}
                onEdit={() => handleEdit(booking)}
                onDelete={() => handleDelete(booking.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="text-no-bookings">
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Nu s-au găsit rezervări care să corespundă filtrelor"
                : "Nu există rezervări încă. Creează prima rezervare pentru a începe."}
            </p>
          </div>
        )}
      </div>

      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        booking={editingBooking}
      />
    </div>
  );
}