import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
              <span className="text-sm font-semibold">{rating}/5</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={onRespond} data-testid={`button-respond-${id}`}>
                {response ? "Editează răspunsul" : "Răspunde"}
              </Button>
              <Button size="sm" variant="ghost" onClick={onDelete} data-testid={`button-delete-${id}`} className="text-destructive">
                Șterge
              </Button>
            </div>
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
