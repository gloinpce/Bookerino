import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: string;
  status: "available" | "occupied" | "maintenance";
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusConfig = {
  available: { label: "Disponibilă", variant: "default" as const },
  occupied: { label: "Ocupată", variant: "secondary" as const },
  maintenance: { label: "Întreținere", variant: "destructive" as const },
};

export function RoomCard({ id, name, type, capacity, price, status, onEdit, onDelete }: RoomCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover-elevate bg-card-gradient border-primary/20 hover:border-primary/40 transition-all" data-testid={`card-room-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold" data-testid={`text-room-name-${id}`}>{name}</h3>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant} data-testid={`badge-status-${id}`}>
            {statusInfo.label}
          </Badge>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={onEdit} data-testid={`button-edit-${id}`}>
              Editează
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} data-testid={`button-delete-${id}`} className="text-destructive">
              Șterge
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{capacity} Oaspeți</span>
          </div>
          <div className="flex items-center gap-1 font-semibold" data-testid={`text-price-${id}`}>
            <span>{price}/noapte</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}