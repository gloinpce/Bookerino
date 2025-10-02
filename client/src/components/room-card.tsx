import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

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
    <Card className="hover-elevate" data-testid={`card-room-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold" data-testid={`text-room-name-${id}`}>{name}</h3>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant} data-testid={`badge-status-${id}`}>
            {statusInfo.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" data-testid={`button-menu-${id}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit} data-testid={`menu-edit-${id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Editează
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive"
                data-testid={`menu-delete-${id}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Șterge
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{capacity} Oaspeți</span>
          </div>
          <div className="flex items-center gap-1 font-semibold" data-testid={`text-price-${id}`}>
            <DollarSign className="h-4 w-4" />
            <span>{price}/noapte</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}