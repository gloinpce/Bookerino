import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface ReviewCardProps {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt: Date;
}

export function ReviewCard({
  id,
  guestName,
  rating,
  comment,
  response,
  createdAt,
}: ReviewCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState(response || "");

  const handleSubmitReply = () => {
    console.log("Submit reply:", replyText);
    setShowReply(false);
  };

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
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm" data-testid={`text-comment-${id}`}>{comment}</p>

        {response && !showReply && (
          <div className="rounded-md bg-muted p-3 mt-3">
            <p className="text-sm font-medium mb-1">Your Response</p>
            <p className="text-sm text-muted-foreground">{response}</p>
          </div>
        )}

        {showReply && (
          <div className="space-y-2 mt-3">
            <Textarea
              placeholder="Write your response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              data-testid={`textarea-reply-${id}`}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmitReply} data-testid={`button-submit-reply-${id}`}>
                Submit Reply
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowReply(false)} data-testid={`button-cancel-reply-${id}`}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showReply && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowReply(true)}
            className="mt-2"
            data-testid={`button-reply-${id}`}
          >
            {response ? "Edit Response" : "Reply"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}