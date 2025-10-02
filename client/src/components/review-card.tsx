import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MoreVertical, MessageSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewCardProps {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  response?: string | null;
  createdAt: Date;
  onRespond?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({
  id,
  guestName,
  rating,
  comment,
  response,
  createdAt,
  onRespond,
  onDelete,
}: ReviewCardProps) {
  return (
    <Card data-testid={`card-review-${id}`}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold" data-testid={`text-guest-${id}`}>{guestName}</h3>
            <p className="text-sm text-muted-foreground">
              {format(createdAt, "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" data-testid={`rating-${id}`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "fill-chart-4 text-chart-4"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" data-testid={`button-menu-${id}`}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRespond} data-testid={`menu-respond-${id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {response ? "Editează răspunsul" : "Răspunde"}
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
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm" data-testid={`text-comment-${id}`}>{comment}</p>

        {response && (
          <div className="rounded-md bg-muted p-3 mt-3">
            <p className="text-sm font-medium mb-1">Răspunsul tău</p>
            <p className="text-sm text-muted-foreground" data-testid={`text-response-${id}`}>{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
