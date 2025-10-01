import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Mail } from "lucide-react";
import { format } from "date-fns";

interface BookingCardProps {
  id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";
  totalPrice: string;
}

const statusConfig = {
  pending: { label: "În așteptare", variant: "secondary" as const },
  confirmed: { label: "Confirmat", variant: "default" as const },
  "checked-in": { label: "Check-in Efectuat", variant: "secondary" as const },
  "checked-out": { label: "Check-out Efectuat", variant: "outline" as const },
  cancelled: { label: "Anulat", variant: "destructive" as const },
};

export function BookingCard({
  id,
  guestName,
  guestEmail,
  roomName,
  checkIn,
  checkOut,
  status,
  totalPrice,
}: BookingCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover-elevate" data-testid={`card-booking-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate" data-testid={`text-guest-name-${id}`}>{guestName}</h3>
            <Badge variant={statusInfo.variant} data-testid={`badge-status-${id}`}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{roomName}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{guestEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {format(checkIn, "MMM d")} - {format(checkOut, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-lg font-semibold" data-testid={`text-price-${id}`}>{totalPrice}</span>
          <Button size="sm" variant="outline" data-testid={`button-view-${id}`}>
            Vezi Detalii
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}