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
    <Card className="group hover-elevate bg-card-gradient border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5" data-testid={`card-room-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors duration-200" data-testid={`text-room-name-${id}`}>{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant} className="shadow-sm" data-testid={`badge-status-${id}`}>
            {statusInfo.label}
          </Badge>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 px-3" data-testid={`button-edit-${id}`}>
              Editează
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10" data-testid={`button-delete-${id}`}>
              Șterge
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="font-medium">{capacity} Oaspeți</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid={`text-price-${id}`}>
            <span className="text-2xl font-bold text-foreground">{price}</span>
            <span className="text-sm text-muted-foreground font-medium">/noapte</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}