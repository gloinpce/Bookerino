import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingCardProps {
  id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";
  totalPrice: string;
  onEdit?: () => void;
  onDelete?: () => void;
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
  onEdit,
  onDelete,
}: BookingCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="group hover-elevate bg-card-gradient border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5" data-testid={`card-booking-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors duration-200 truncate" data-testid={`text-guest-name-${id}`}>{guestName}</h3>
            <Badge variant={statusInfo.variant} className="shadow-sm" data-testid={`badge-status-${id}`}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate font-medium">{roomName}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 px-3" data-testid={`button-edit-${id}`}>
            Editează
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10" data-testid={`button-delete-${id}`}>
            Șterge
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground truncate font-medium">{guestEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground font-medium">
            {format(checkIn, "MMM d")} - {format(checkOut, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-card-border">
          <span className="text-2xl font-bold tracking-tight" data-testid={`text-price-${id}`}>{totalPrice} RON</span>
        </div>
      </CardContent>
    </Card>
  );
}